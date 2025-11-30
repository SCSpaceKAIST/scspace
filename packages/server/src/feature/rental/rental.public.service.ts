import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository';
import {
    IRental,
    IGoods,
    IGoodsFilter,
    IGoodsAvailabilityCheck
} from '@scspace-depot/types/rental';
import { MRental, MGoods } from './rental.model';
import { IDataResponse } from '@scspace-depot/types/common';
import { OrganizationPublicService } from "@scspace-server/feature/organization/organization.public.service";

@Injectable()
export class RentalPublicService {
    constructor(
        private readonly rentalRepository: RentalRepository,
        private readonly organizationPublicService: OrganizationPublicService
    ) { }

    // Rental 관련 public methods
    async getRentalById(id: number): Promise<IRental | null> {
        const rental = await this.rentalRepository.fetchRentalById(id);
        return rental ? MRental.fromDB(rental) : null;
    }

    async getRentalsByIds(ids: number[]): Promise<IRental[]> {
        if (ids.length === 0) return [];

        const rentals = await Promise.all(
            ids.map(id => this.rentalRepository.fetchRentalById(id))
        );

        return rentals
            .filter((rental): rental is NonNullable<typeof rental> => rental !== null)
            .map(rental => MRental.fromDB(rental));
    }

    //Only 개인 렌탈만 fetch함
    async getRentalsByUserId(
        userId: number,
        isActive?: boolean,
        limit: number = 50,
        offset: number = 0
    ): Promise<IDataResponse<IRental[]>> {

        //only individual
        const result = await this.rentalRepository.fetchRentalsByUserId(
            userId,
            isActive,
            true,
            limit,
            offset
        );

        return {
            data: result.data.map(rental => MRental.fromDB(rental)),
            count: result.count
        };
    }

    //Only Organization 렌탈만 fetch함
    async getRentalsByOrganizationId(
        organizationId: number,
        isActive?: boolean,
        limit: number = 50,
        offset: number = 0
    ): Promise<IDataResponse<IRental[]>> {
        const result = await this.rentalRepository.fetchRentalsByOrganizationId(
            organizationId,
            isActive,
            limit,
            offset
        )

        return {
            data : result.data.map(rental => MRental.fromDB(rental)),
            count : result.count
        }
    }

    //fetch 개인 렌탈 + 개인이 속한 모든 조직의 Rental
    async getRentalsFull(
        userId: number,
        isActive?: boolean,
        limit: number = 50,
        offset: number = 0
    ): Promise<IDataResponse<IRental[]>> {
        const orgs = await this.organizationPublicService.fetchByUserId(userId);
        const orgIds = orgs.map(org => org.id);

        const result = await this.rentalRepository.fetchRentalsFull(
            userId,
            orgIds,
            isActive,
            limit,
            offset
        )

        return {
            data : result.data.map(rental => MRental.fromDB(rental)),
            count : result.count
        }
    }

    // Goods 관련 public methods
    async getGoodsById(id: number): Promise<IGoods | null> {
        const goods = await this.rentalRepository.fetchGoodsById(id);
        return goods ? MGoods.fromDB(goods) : null;
    }

    async getGoodsByIds(ids: number[]): Promise<IGoods[]> {
        if (ids.length === 0) return [];

        const goods = await Promise.all(
            ids.map(id => this.rentalRepository.fetchGoodsById(id))
        );

        return goods
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .map(item => MGoods.fromDB(item));
    }

    async getAllGoods(): Promise<IGoods[]> {
        return await this.rentalRepository.fetchAllGoods();
    }

    async checkGoodsAvailability(check: IGoodsAvailabilityCheck): Promise<boolean> {
        return await this.rentalRepository.checkGoodsAvailability(check);
    }

    async checkRentalLimit(userId: number): Promise<boolean> {
        return await this.rentalRepository.checkRentalLimit(userId);
    }

    async checkRentalLimitOrganization(orgId : number) : Promise<boolean> {
        return await this.rentalRepository.checkRentalLimitByOrganization(orgId);
    }

    async checkCurrentOverdue(userId: number, orgId : number): Promise<boolean> {
        return await this.rentalRepository.checkCurrentOverdue(userId, orgId);
    }

    /**
     * @deprecated
     * @param userId
     */
    async checkUnconfirmedOverdueReturns(userId: number): Promise<boolean> {
        return await this.rentalRepository.checkUnconfirmedOverdueReturns(userId);
    }

    /**
     * @deprecated
     * @param userId
     */
    async checkUserOverduePenalty(userId: number): Promise<boolean> {
        return await this.rentalRepository.checkUserOverduePenalty(userId);
    }

    async getOverdueRentals(): Promise<IRental[]> {
        const overdueRentals = await this.rentalRepository.getOverdueRentals();
        return overdueRentals.map(rental => MRental.fromDB(rental));
    }
}
