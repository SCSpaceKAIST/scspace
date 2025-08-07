import { BadRequestException, Injectable } from "@nestjs/common";
import { OrganizationPublicService } from "@scspace-server/feature/organization/organization.public.service";
import { LotterySeminarRepository } from "./lottery.seminar.repository";
import { LotterySeminarInfoRepository } from "./lottery.seminar.info.repository";
import { MSeminarLottery } from "./lottery.seminar.model";
import { MSeminarLotteryInfo } from "./lottery.seminar.info.model";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";
import {
    ILotteryInfoCreate,
    ILotteryInfoUpdate,
    ISeminarLotteryCreate,
    ISeminarLotteryUpdate
} from "@scspace-depot/types/lottery";
import { getNow } from "@scspace-server/common/utils";

@Injectable()
export class LotterySeminarService {
    // This service will handle the data access for seminar lottery-related operations
    // Currently, no specific methods are defined
    constructor(
        private readonly organizationPublicService: OrganizationPublicService,
        private readonly lotterySeminarRepository: LotterySeminarRepository,
        private readonly lotterySeminarInfoRepository: LotterySeminarInfoRepository
    ) { }

    async getAllSeminarLotteryInfo(): Promise<MSeminarLotteryInfo[]> {
        // Implementation for fetching all seminar lottery info
        const seminarLotteryInfo = await this.lotterySeminarInfoRepository.fetchAll();
        return seminarLotteryInfo;
    }

    async postSeminarLotteryInfo(params: {
        lotteryInfo: ILotteryInfoCreate
    }): Promise<MSeminarLotteryInfo> {
        const now = getNow();
        if (params.lotteryInfo.timeLotteryStart < now) {
            throw new BadRequestException("Lottery time cannot be in the past");
        }
        if (params.lotteryInfo.timeLotteryEnd < params.lotteryInfo.timeLotteryStart) {
            throw new BadRequestException("Lottery end time cannot be before start time");
        }
        if (params.lotteryInfo.timeStart < params.lotteryInfo.timeLotteryEnd) {
            throw new BadRequestException("Start time cannot be before lottery end time");
        }
        if (params.lotteryInfo.timeEnd < params.lotteryInfo.timeStart) {
            throw new BadRequestException("Start time cannot be after end time");
        }
        // Implementation for inserting a new seminar lottery info
        const createdLotteryInfo = await this.lotterySeminarInfoRepository.insert(
            params.lotteryInfo
        );
        return createdLotteryInfo;
    }

    async updateSeminarLotteryInfo(params: {
        id: number;
        updateLotteryInfo: ILotteryInfoUpdate;
    }): Promise<MSeminarLotteryInfo> {
        const seminarLotteryInfo = await this.lotterySeminarInfoRepository.fetch({
            id: params.id
        });
        if (!seminarLotteryInfo) {
            throw new BadRequestException("Seminar lottery info not found");
        }

        const now = getNow();
        if (params.updateLotteryInfo.timeLotteryStart < now) {
            throw new BadRequestException("Lottery time cannot be in the past");
        }
        if (params.updateLotteryInfo.timeLotteryEnd < params.updateLotteryInfo.timeLotteryStart) {
            throw new BadRequestException("Lottery end time cannot be before start time");
        }
        if (params.updateLotteryInfo.timeStart < params.updateLotteryInfo.timeLotteryEnd) {
            throw new BadRequestException("Start time cannot be before lottery end time");
        }
        if (params.updateLotteryInfo.timeEnd < params.updateLotteryInfo.timeStart) {
            throw new BadRequestException("Start time cannot be after end time");
        }
        // Implementation for updating seminar lottery info
        const updatedLotteryInfo = await this.lotterySeminarInfoRepository.update(params);
        return updatedLotteryInfo;
    }

    async deleteSeminarLotteryInfo(id: number): Promise<boolean> {
        const seminarLotteryInfo = await this.lotterySeminarInfoRepository.fetch({ id });
        if (!seminarLotteryInfo) {
            throw new BadRequestException("Seminar lottery info not found");
        }
        // Implementation for deleting seminar lottery info
        return await this.lotterySeminarInfoRepository.delete(id);
    }

    async getSeminarLotteryByOrganization(params: {
        organizationId: number;
        spaceId: number;
        infoId: number;
    }): Promise<MSeminarLottery[]> {
        // Implementation for fetching organization lottery data
        // This is a placeholder implementation
        return this.lotterySeminarRepository.fetch(params);
    }

    async getSeminarLotteryByTime(params: {
        time: number;
        spaceId: number;
        infoId: number;
    }): Promise<MSeminarLottery[]> {
        // Implementation for fetching seminar lottery data by time
        return this.lotterySeminarRepository.fetch(params);
    }

    async postSeminarLottery(params: {
        lottery: ISeminarLotteryCreate
    }): Promise<MSeminarLottery> {
        const organization = await this.organizationPublicService.fetchById(params.lottery.organizationId);
        if (!organization) {
            throw new BadRequestException("Organization not found");
        }
        if (organization.status !== OrganizationStatusEnum.VERIFIED) {
            throw new BadRequestException("Only verified organizations can create seminar lotteries");
        }

        const pastLotteries = await this.lotterySeminarRepository.fetch({
            organizationId: params.lottery.organizationId,
            spaceId: params.lottery.spaceId,
            infoId: params.lottery.infoId
        });
        if (pastLotteries.length >= 6) {
            throw new BadRequestException("Maximum number of seminar lotteries is 6. Cannot create more.");
        }
        // Implementation for inserting a new seminar lottery
        const createdLottery = await this.lotterySeminarRepository.insert(params.lottery);
        return createdLottery;
    }

    async updateSeminarLottery(params: {
        id: number;
        updateLottery: ISeminarLotteryUpdate;
    }): Promise<MSeminarLottery> {
        const seminarLottery = await this.lotterySeminarRepository.fetch({ id: params.id });
        if (!seminarLottery) {
            throw new BadRequestException("Seminar lottery not found");
        }

        // Implementation for updating seminar lottery data
        const updatedLottery = await this.lotterySeminarRepository.update({
            id: params.id,
            updateLottery: params.updateLottery
        });
        return updatedLottery;
    }

    async deleteSeminarLottery(id: number): Promise<boolean> {
        const seminarLottery = await this.lotterySeminarRepository.fetch({ id });
        if (!seminarLottery) {
            throw new BadRequestException("Seminar lottery not found");
        }
        // Implementation for deleting seminar lottery data
        return await this.lotterySeminarRepository.delete(id);
    }
}