import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    IRentalCreate,
    IRentalUpdate,
    IRentalAll,
    IRental,
    IGoodsCreate,
    IGoodsUpdate,
    IGoods,
    IGoodsFilter,
    IRentalReturn,
    IRentalConfirm,
    IGoodsAvailabilityCheck,
    IUserRentalStatus,
    IRentalCreateClient,
} from '@scspace-depot/types/rental';
import { IDataResponse, ISuccessResponse } from '@scspace-depot/types/common';
import { checkContainAllId, takeAll, getNow, getDate, getTime, getDateEnd } from '@scspace-server/common/utils';
import { RentalRepository } from './rental.repository';
import { RentalPublicService } from './rental.public.service';
import { UserPublicService } from '../user/user.public.service';
import { IUser } from '@scspace-depot/types/user';

@Injectable()
export class RentalService {
    constructor(
        private readonly rentalRepository: RentalRepository,
        private readonly rentalPublicService: RentalPublicService,
        private readonly userPublicService: UserPublicService,
    ) { }

    // Rental 관련 서비스 메서드들
    async createRental(rentalData: IRentalCreateClient & { userId: number }): Promise<{ success: boolean; data: { id: number } }> {
        // 물품 가용성 확인
        const now = getNow();
        const _now = getDate(now);
        _now.setDate(_now.getDate() + 7);
        const afterOneWeek = getDateEnd(getTime(_now));

        const availability: IGoodsAvailabilityCheck = {
            goodsId: rentalData.goodsId,
            count: rentalData.count,
            timeBorrow: now,
            timeDue: afterOneWeek,
        };

        const isAvailable = await this.rentalPublicService.checkGoodsAvailability(availability);
        if (!isAvailable) {
            throw new BadRequestException('Requested goods are not available for the specified period');
        }

        // 물품 재고 감소
        const goods = await this.rentalPublicService.getGoodsById(rentalData.goodsId);
        if (!goods) {
            throw new NotFoundException('Goods not found');
        }

        if (goods.countNow < rentalData.count) {
            throw new BadRequestException('Insufficient stock');
        }

        const id = await this.rentalRepository.createRental({
            ...rentalData,
            timeBorrow: now,
            timeDue: afterOneWeek
        });

        // 재고 업데이트
        await this.rentalRepository.updateGoodsStock(
            rentalData.goodsId,
            goods.countNow - rentalData.count
        );

        return {
            success: true,
            data: { id }
        };
    }

    async getRentalById(id: number): Promise<IRentalAll> {
        const rental = await this.rentalPublicService.getRentalById(id);
        if (!rental) {
            throw new NotFoundException('Rental not found');
        }

        const [user, goods] = await Promise.all([
            this.userPublicService.fetchById(rental.userId),
            this.rentalPublicService.getGoodsById(rental.goodsId),
        ]);

        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!goods) {
            throw new NotFoundException('Goods not found');
        }

        return {
            ...rental,
            user,
            goods,
        };
    }

    async getRentalList(
        limit: number = 50,
        offset: number = 0
    ): Promise<IDataResponse<IRentalAll[]>> {
        const { data: rentals, count } = await this.rentalRepository.fetchAllRentals(limit, offset);

        if (rentals.length === 0) {
            return { data: [], count };
        }

        const userIds = [...new Set(rentals.map(r => r.userId))];
        const goodsIds = [...new Set(rentals.map(r => r.goodsId))];

        const [users, goods] = await Promise.all([
            this.userPublicService.fetchAllByIds(userIds).then(takeAll(userIds, 'users')),
            this.rentalPublicService.getGoodsByIds(goodsIds),
        ]) as [IUser[], IGoods[]];

        checkContainAllId(userIds, users, 'users');
        checkContainAllId(goodsIds, goods, 'goods');

        const rentalsWithDetails = rentals.map(rental => ({
            ...rental,
            user: users.find(u => u.id === rental.userId)!,
            goods: goods.find(g => g.id === rental.goodsId)!,
        }));

        return {
            data: rentalsWithDetails,
            count
        };
    }

    async getUserRentals(params: IUserRentalStatus): Promise<IDataResponse<IRentalAll[]>> {
        const { userId, isActive } = params;

        const { data: rentals, count } = await this.rentalPublicService.getRentalsByUserId(
            userId,
            isActive,
            50,
            0
        );

        if (rentals.length === 0) {
            return { data: [], count };
        }

        const goodsIds = [...new Set(rentals.map(r => r.goodsId))];
        const [user, goods] = await Promise.all([
            this.userPublicService.fetchById(userId),
            this.rentalPublicService.getGoodsByIds(goodsIds),
        ]);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        checkContainAllId(goodsIds, goods, 'goods');

        const rentalsWithDetails = rentals.map(rental => ({
            ...rental,
            user,
            goods: goods.find(g => g.id === rental.goodsId)!,
        }));

        return {
            data: rentalsWithDetails,
            count
        };
    }

    async updateRental(id: number, updates: IRentalUpdate): Promise<ISuccessResponse> {
        const existingRental = await this.rentalPublicService.getRentalById(id);
        if (!existingRental) {
            throw new NotFoundException('Rental not found');
        }

        await this.rentalRepository.updateRental(id, updates);

        return { success: true };
    }

    async returnRental(returnData: IRentalReturn): Promise<ISuccessResponse> {
        const { id, timeReturn } = returnData;

        const rental = await this.rentalPublicService.getRentalById(id);
        if (!rental) {
            throw new NotFoundException('Rental not found');
        }

        if (rental.timeReturn !== 0) {
            throw new BadRequestException('This rental has already been returned');
        }

        await this.rentalRepository.returnRental(id, timeReturn);

        // 재고 복구
        const goods = await this.rentalPublicService.getGoodsById(rental.goodsId);
        if (goods) {
            await this.rentalRepository.updateGoodsStock(
                rental.goodsId,
                goods.countNow + rental.count
            );
        }

        return { success: true };
    }

    async confirmReturn(confirmData: IRentalConfirm): Promise<ISuccessResponse> {
        const { id, timeConfirm } = confirmData;

        const rental = await this.rentalPublicService.getRentalById(id);
        if (!rental) {
            throw new NotFoundException('Rental not found');
        }

        if (rental.timeReturn === 0) {
            throw new BadRequestException('This rental has not been returned yet');
        }

        if (rental.timeConfirm !== 0) {
            throw new BadRequestException('This return has already been confirmed');
        }

        await this.rentalRepository.confirmReturn(id, timeConfirm);

        return { success: true };
    }

    async deleteRental(id: number): Promise<ISuccessResponse> {
        const rental = await this.rentalPublicService.getRentalById(id);
        if (!rental) {
            throw new NotFoundException('Rental not found');
        }

        // 반납되지 않은 대여는 삭제 시 재고 복구
        if (rental.timeReturn === 0) {
            const goods = await this.rentalPublicService.getGoodsById(rental.goodsId);
            if (goods) {
                await this.rentalRepository.updateGoodsStock(
                    rental.goodsId,
                    goods.countNow + rental.count
                );
            }
        }

        await this.rentalRepository.deleteRental(id);

        return { success: true };
    }

    // Goods 관련 서비스 메서드들
    async createGoods(goodsData: IGoodsCreate): Promise<{ success: boolean; data: { id: number } }> {
        const id = await this.rentalRepository.createGoods(goodsData);
        return {
            success: true,
            data: { id }
        };
    }

    async getGoodsById(id: number): Promise<IGoods> {
        const goods = await this.rentalPublicService.getGoodsById(id);
        if (!goods) {
            throw new NotFoundException('Goods not found');
        }
        return goods;
    }

    async getGoodsList(): Promise<IGoods[]> {
        return await this.rentalPublicService.getAllGoods();
    }

    async updateGoods(id: number, updates: IGoodsUpdate): Promise<ISuccessResponse> {
        const existingGoods = await this.rentalPublicService.getGoodsById(id);
        if (!existingGoods) {
            throw new NotFoundException('Goods not found');
        }

        const countNow = existingGoods.countNow + updates.countAll - existingGoods.countAll;

        if (countNow < 0) {
            throw new BadRequestException('Insufficient stock');
        }

        await this.rentalRepository.updateGoods(id, {
            ...updates,
            countNow
        });

        return { success: true };
    }

    async deleteGoods(id: number): Promise<ISuccessResponse> {
        const goods = await this.rentalPublicService.getGoodsById(id);
        if (!goods) {
            throw new NotFoundException('Goods not found');
        }

        // 해당 물품에 대한 활성 대여가 있는지 확인
        const activeRentals = await this.rentalPublicService.getRentalsByUserId(0, true, 1000, 0);
        const hasActiveRentals = activeRentals.data.some(rental => rental.goodsId === id);

        if (hasActiveRentals) {
            throw new BadRequestException('Cannot delete goods with active rentals');
        }

        await this.rentalRepository.deleteGoods(id);

        return { success: true };
    }

    async getOverdueRentals(): Promise<IRentalAll[]> {
        const overdueRentals = await this.rentalPublicService.getOverdueRentals();

        if (overdueRentals.length === 0) {
            return [];
        }

        const userIds = [...new Set(overdueRentals.map(r => r.userId))];
        const goodsIds = [...new Set(overdueRentals.map(r => r.goodsId))];

        const [users, goods] = await Promise.all([
            this.userPublicService.fetchAllByIds(userIds).then(takeAll(userIds, 'users')),
            this.rentalPublicService.getGoodsByIds(goodsIds),
        ]) as [IUser[], IGoods[]];

        checkContainAllId(userIds, users, 'users');
        checkContainAllId(goodsIds, goods, 'goods');

        return overdueRentals.map(rental => ({
            ...rental,
            user: users.find(u => u.id === rental.userId)!,
            goods: goods.find(g => g.id === rental.goodsId)!,
        }));
    }
}
