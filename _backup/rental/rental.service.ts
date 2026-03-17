import {
    BadRequestException,
    Injectable, Logger,
    NotFoundException,
} from "@nestjs/common";
import {
    IRentalUpdate,
    IRentalAll,
    IGoodsCreate,
    IGoodsUpdate,
    IGoods,
    IGoodsAvailabilityCheck,
    IUserRentalStatus,
    IRentalCreateClient,
} from '@scspace-depot/types/rental';
import { IDataResponse, ISuccessResponse } from '@scspace-depot/types/common';
import { checkContainAllId, takeAll, getNow, getDate, getTime, getDateEnd, getDateDiffInMinute, getDateString } from '@scspace-server/common/utils';
import { RentalRepository } from './rental.repository';
import { RentalPublicService } from './rental.public.service';
import { UserPublicService } from '../user/user.public.service';
import { IUser } from '@scspace-depot/types/user';
import { MAX_RENTAL_DURATION, MAX_RENTAL_LIMIT } from '@scspace-depot/consts/rental.const';
import { FileService } from '@scspace-server/tools/file/file.service';
import { PdfService } from "@scspace-server/tools/pdf/pdf.service";
import { ICertificatePdf } from "@scspace-depot/types/pdf/pdf.type";
import { MailService } from "@scspace-server/tools/mailer/mail.service";
import { RentalMeta } from "@scspace-depot/enums/mail.enum";

@Injectable()
export class RentalService {
    constructor(
        private readonly rentalRepository: RentalRepository,
        private readonly rentalPublicService: RentalPublicService,
        private readonly userPublicService: UserPublicService,
        private readonly fileService: FileService,
        private readonly pdfService: PdfService,
        private readonly mailService: MailService
    ) { }

    // Rental 관련 서비스 메서드들
    async createRental(rentalData: IRentalCreateClient & { userId: number }): Promise<{ success: boolean; data: { id: number } }> {

        // 1. 대여 개수 제한 확인
        const limitOk = await this.rentalPublicService.checkRentalLimit(rentalData.userId);
        if (!limitOk) {
            throw new BadRequestException(`User has reached the maximum rental limit: ${MAX_RENTAL_LIMIT}`);
        }

        // 2. 현재 연체된 대여 확인
        const overdueOk = await this.rentalPublicService.checkCurrentOverdue(rentalData.userId);
        if (!overdueOk) {
            throw new BadRequestException('Cannot create new rental: user has overdue rentals that must be returned first');
        }

        // 3. 관리자 확인 대기 중인 연체 반납 확인
        const unconfirmedOk = await this.rentalPublicService.checkUnconfirmedOverdueReturns(rentalData.userId);
        if (!unconfirmedOk) {
            throw new BadRequestException('Cannot create new rental: user has overdue returns pending administrator confirmation');
        }

        // 4. 연체 제재 기간 확인
        const penaltyOk = await this.rentalPublicService.checkUserOverduePenalty(rentalData.userId);
        if (!penaltyOk) {
            // 사용자 정보를 가져와서 언제부터 대여 가능한지 알려주기
            const user = await this.userPublicService.fetchById(rentalData.userId);
            if (user && user.timeOverdue > 0) {
                throw new BadRequestException(`User is currently under rental penalty due to overdue returns. Rental will be available again after: ${getDateString(user.timeOverdue)}`);
            } else {
                throw new BadRequestException('User is currently under rental penalty due to overdue returns');
            }
        }

        // 물품 가용성 확인
        const now = getNow();
        const _now = getDate(now);
        _now.setDate(_now.getDate() + MAX_RENTAL_DURATION);
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

        // 3.4: 대여 성공 시 timeOverdue 초기화
        const user = await this.userPublicService.fetchById(rentalData.userId);
        if (user && user.timeOverdue !== 0) {
            await this.userPublicService.updateOverdue(rentalData.userId, {
                timeOverdue: 0
            });
        }

        //Rental Cert
        try {
            const meta: ICertificatePdf = {
                id: id,
                user: user,
                goods: goods,
                contact: user.email,
                rentalFrom: getDateString(now),
                rentalTo: getDateString(afterOneWeek),
                rentalDuration: MAX_RENTAL_DURATION, // # day - might be 7
                rentalQuantity: rentalData.count,
            }

            const res = await this.pdfService.createAndStoreRentalCert(meta)

            await this.rentalRepository.updateRentalCert(id, res.filename);

            //rental mail notif

            await this.mailService.sendMail({
                to: "scspace.kaist@gmail.com",
                bcc: "jhlee012@kaist.ac.kr",
                template: "rentalNotif",
                subject: "[SCSpace] 새로운 대여가 있습니다.",
                context: {
                    meta: meta,
                }
            })

        } catch (error) {
            console.log(error)

            const err = error instanceof Error
                ? error
                : new Error(String(error))
            await this.mailService.reportError(err,
                "pdf.service.ts > createRentalConfirmPdf")
            throw err;
        }

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

    async getUserRentals(params: IUserRentalStatus): Promise<IRentalAll[]> {
        const { userId, isActive } = params;

        const { data: rentals, count } = await this.rentalPublicService.getRentalsByUserId(
            userId,
            isActive,
            50,
            0
        );

        if (rentals.length === 0) {
            return [];
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

        return rentalsWithDetails;
    }

    async updateRental(id: number, updates: IRentalUpdate): Promise<ISuccessResponse> {
        const existingRental = await this.rentalPublicService.getRentalById(id);
        if (!existingRental) {
            throw new NotFoundException('Rental not found');
        }

        await this.rentalRepository.updateRental(id, updates);

        return { success: true };
    }

    async returnRental(id: number): Promise<ISuccessResponse> {

        const rental = await this.rentalPublicService.getRentalById(id);
        if (!rental) {
            throw new NotFoundException('Rental not found');
        }

        if (rental.timeReturn !== 0) {
            throw new BadRequestException('This rental has already been returned');
        }

        await this.rentalRepository.returnRental(id, getNow());

        return { success: true };
    }

    async confirmReturn(id: number): Promise<ISuccessResponse> {
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

        // 재고 복구
        const goods = await this.rentalPublicService.getGoodsById(rental.goodsId);
        if (goods) {
            await this.rentalRepository.updateGoodsStock(
                rental.goodsId,
                goods.countNow + rental.count
            );
        }

        // 연체된 대여인지 확인
        const isOverdue = rental.timeDue < rental.timeReturn;

        if (isOverdue) {
            // 연체 기간 계산 (일 단위)
            const overdueDays = Math.ceil(
                getDateDiffInMinute(rental.timeReturn, rental.timeDue) / (60 * 24)
            );

            // 사용자 정보 가져오기
            const user = await this.userPublicService.fetchById(rental.userId);
            if (!user) {
                throw new NotFoundException('User not found');
            }

            // 새로운 timeOverdue 계산
            let newTimeOverdue: number;
            const now = getNow();

            if (user.timeOverdue === 0) {
                // 3.2: 첫 연체인 경우, timeReturn부터 연체된 날짜만큼 뒤 23:59:59
                const overdueEndDate = getDate(rental.timeReturn);
                overdueEndDate.setDate(overdueEndDate.getDate() + overdueDays);
                overdueEndDate.setHours(23, 59, 59, 999);
                newTimeOverdue = getTime(overdueEndDate);
            } else {
                // 3.3: 이미 연체 기록이 있는 경우, 기존 timeOverdue에 연체 기간 추가
                const existingOverdueEndDate = getDate(user.timeOverdue);
                existingOverdueEndDate.setDate(existingOverdueEndDate.getDate() + overdueDays);
                newTimeOverdue = getTime(existingOverdueEndDate);
            }

            // 사용자의 timeOverdue 업데이트
            await this.userPublicService.updateOverdue(rental.userId, {
                timeOverdue: newTimeOverdue
            });
        }


        //File Deletetion

        await this.fileService.deletePrivateFile(rental.certName)

        await this.rentalRepository.confirmReturn(id, getNow())

        //mailer << Unnecessary - Currently Delayed


        const user = await this.userPublicService.fetchById(rental.userId);
        // Organization << 언젠간 추가되지 않을까? (모름)

        return { success: true };
    }

    // async deleteRental(id: number): Promise<ISuccessResponse> {
    //     const rental = await this.rentalPublicService.getRentalById(id);
    //     if (!rental) {
    //         throw new NotFoundException('Rental not found');
    //     }

    //     // 반납되지 않은 대여는 삭제 시 재고 복구
    //     if (rental.timeReturn === 0) {
    //         const goods = await this.rentalPublicService.getGoodsById(rental.goodsId);
    //         if (goods) {
    //             await this.rentalRepository.updateGoodsStock(
    //                 rental.goodsId,
    //                 goods.countNow + rental.count
    //             );
    //         }
    //     }

    //     await this.rentalRepository.deleteRental(id);

    //     return { success: true };
    // }

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

        if (updates.imageURI) {
            await this.fileService.deletePublicFile(existingGoods.imageURI);
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

        await this.fileService.deletePublicFile(goods.imageURI);

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

    //send return request mail to specific rental (FYI : overdue not required)
    async rentalReturnRequest(id: number): Promise<{
        success: boolean,
        id: number,
    }> {
        const rental = await this.rentalPublicService.getRentalById(id);
        if (!rental) {
            throw new NotFoundException('Rental not found');
        }
        const goods = await this.rentalPublicService.getGoodsById(rental.goodsId);
        if (!goods) {
            throw new NotFoundException('Goods not found');
        }
        const user = await this.userPublicService.fetchById(rental.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const meta = RentalMeta.requestReturn

        const dates = {
            timeFrom: getDateString(rental.timeBorrow),
            timeTo: getDateString(rental.timeDue),
            overdue: rental.timeDue < getNow() ? String(Math.ceil(getDateDiffInMinute(getNow(), rental.timeDue)) / (60 * 24)) : '0'
        }

        const rentalMeta = {
            title: goods.name,
            user: user,
            timeFrom: dates.timeFrom,
            timeTo: dates.timeTo,
            overdue: dates.overdue,
        }

        try {
            Logger.log('Sending Return Request mail for Rental ID : ' + id + ' by User : ' + user.nameKr + '')
            Logger.log(meta)
            Logger.log(rentalMeta)
            await this.mailService.sendMail({
                to: user.email,
                bcc: "jhlee012@kaist.ac.kr",
                template: "rentalReturnReq",
                subject: "[SCSpace] 대여 기한 만료 안내 및 반납 요청",
                context: {
                    meta: meta,
                    rental: rentalMeta,
                }
            });
        } catch (error) {
            console.log(error)
            await this.mailService.reportError(
                error instanceof Error
                    ? error
                    : new Error(String(error)),
                "Rental Return Request - Mail Sector")
        }


        return {
            success: true,
            id: id,
        };
    }

    //send request return mail to all overdue rentals
    async rentalReturnRequestAll(): Promise<{
        success: boolean,
        id: number,
    }[]> {
        const rentals = await this.rentalPublicService.getOverdueRentals();
        const res = await Promise.allSettled(
            rentals.map(r => this.rentalReturnRequest(r.id))
        )
        return res.filter(r => r.status === 'fulfilled').map(r => r.value)
    }
}
