import { BadRequestException, Injectable, Logger } from "@nestjs/common";
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
} from "@scspace-depot/types/lottery";
import { getDateBegin, getDateEnd, getNow, getRandomIndex } from "@scspace-server/common/utils";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SpacePublicService } from "@scspace-server/feature/space/space.public.service";
import { SpaceTypeEnum } from "@scspace-depot/enums/space.enum";

@Injectable()
export class LotterySeminarService {
    // This service will handle the data access for seminar lottery-related operations
    // Currently, no specific methods are defined
    constructor(
        private readonly organizationPublicService: OrganizationPublicService,
        private readonly spacePublicService: SpacePublicService,
        private readonly lotterySeminarRepository: LotterySeminarRepository,
        private readonly lotterySeminarInfoRepository: LotterySeminarInfoRepository
    ) { }

    async getAllSeminarLotteryInfo(): Promise<MSeminarLotteryInfo[]> {
        // 자동 정렬된 모든 세미나 추첨 정보 조회
        const seminarLotteryInfo = await this.lotterySeminarInfoRepository.fetchAll();
        return seminarLotteryInfo;
    }

    async getActiveSeminarLotteryInfo(): Promise<MSeminarLotteryInfo[]> {
        // 현재 진행 중인 추첨 정보들 조회 (시간 순 정렬)
        const now = getNow();
        return await this.lotterySeminarInfoRepository.fetchActiveLotteries(now);
    }

    async getUpcomingSeminarLotteryInfo(): Promise<MSeminarLotteryInfo[]> {
        // 예정된 추첨 정보들 조회 (시간 순 정렬)
        const now = getNow();
        return await this.lotterySeminarInfoRepository.fetchUpcomingLotteries(now);
    }

    /**
     * 시간 겹침 검증 - 추첨 시작 시간부터 행사 끝 시간까지 겹치는지 확인
     */
    private async validateTimeConflict(
        lotteryInfo: { timeLotteryStart: number; timeEnd: number },
        excludeId?: number
    ): Promise<void> {
        const allLotteries = await this.lotterySeminarInfoRepository.fetchAll();

        // 현재 수정 중인 항목은 제외
        const otherLotteries = excludeId
            ? allLotteries.filter(lottery => lottery.id !== excludeId)
            : allLotteries;

        const newStartTime = lotteryInfo.timeLotteryStart;
        const newEndTime = lotteryInfo.timeEnd;

        for (const existingLottery of otherLotteries) {
            const existingStartTime = existingLottery.timeLotteryStart;
            const existingEndTime = existingLottery.timeEnd;

            // 시간 겹침 검사: 새로운 기간과 기존 기간이 겹치는지 확인
            // A: [newStartTime ---- newEndTime]
            // B: [existingStartTime ---- existingEndTime]
            // 겹치지 않는 조건: newEndTime <= existingStartTime OR newStartTime >= existingEndTime
            // 겹치는 조건: !(겹치지 않는 조건)
            const isOverlapping = !(newEndTime <= existingStartTime || newStartTime >= existingEndTime);

            if (isOverlapping) {
                throw new BadRequestException(
                    `Time conflict detected. The period from lottery start to event end overlaps with existing lottery (ID: ${existingLottery.id})`
                );
            }
        }
    }

    async postSeminarLotteryInfo(params: {
        lotteryInfo: ILotteryInfoCreate
    }): Promise<MSeminarLotteryInfo> {
        const now = getNow();

        // 시간 유효성 검증
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

        // 시간 겹침 검증
        await this.validateTimeConflict({
            timeLotteryStart: params.lotteryInfo.timeLotteryStart,
            timeEnd: params.lotteryInfo.timeEnd
        });

        // 추첨 정보 생성 (자동 정렬됨)
        const createdLotteryInfo = await this.lotterySeminarInfoRepository.insert({
            timeStart: getDateBegin(params.lotteryInfo.timeStart),
            timeEnd: getDateEnd(params.lotteryInfo.timeEnd),
            timeLotteryStart: getDateBegin(params.lotteryInfo.timeLotteryStart),
            timeLotteryEnd: getDateEnd(params.lotteryInfo.timeLotteryEnd)
        });
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

        // 업데이트할 값들을 기존 값과 병합
        const mergedLotteryInfo = {
            timeLotteryStart: params.updateLotteryInfo.timeLotteryStart ?? seminarLotteryInfo.timeLotteryStart,
            timeLotteryEnd: params.updateLotteryInfo.timeLotteryEnd ?? seminarLotteryInfo.timeLotteryEnd,
            timeStart: params.updateLotteryInfo.timeStart ?? seminarLotteryInfo.timeStart,
            timeEnd: params.updateLotteryInfo.timeEnd ?? seminarLotteryInfo.timeEnd,
        };

        // 시간 유효성 검증
        // if (mergedLotteryInfo.timeLotteryStart < now) {
        //     throw new BadRequestException("Lottery time cannot be in the past");
        // }
        if (mergedLotteryInfo.timeLotteryEnd < mergedLotteryInfo.timeLotteryStart) {
            throw new BadRequestException("Lottery end time cannot be before start time");
        }
        if (mergedLotteryInfo.timeStart < mergedLotteryInfo.timeLotteryEnd) {
            throw new BadRequestException("Start time cannot be before lottery end time");
        }
        if (mergedLotteryInfo.timeEnd < mergedLotteryInfo.timeStart) {
            throw new BadRequestException("Start time cannot be after end time");
        }

        // 시간 겹침 검증 (현재 수정 중인 항목 제외)
        await this.validateTimeConflict({
            timeLotteryStart: mergedLotteryInfo.timeLotteryStart,
            timeEnd: mergedLotteryInfo.timeEnd
        }, params.id);

        // 추첨 정보 업데이트 (자동 정렬됨)
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

        const activeLottery = await this.lotterySeminarInfoRepository.fetchActiveLotteries(getNow());
        if (activeLottery.length === 0 || activeLottery[0].id !== params.lottery.infoId) {
            throw new BadRequestException("Active lottery not found");
        }

        const pastLotteries = await this.lotterySeminarRepository.fetch({
            organizationId: params.lottery.organizationId,
            spaceId: params.lottery.spaceId,
            infoId: params.lottery.infoId
        });
        if (pastLotteries.find(lottery => lottery.time === params.lottery.time)) {
            throw new BadRequestException("A seminar lottery with the same time already exists.");
        }
        if (pastLotteries.length >= 6) {
            throw new BadRequestException("Maximum number of seminar lotteries is 6. Cannot create more.");
        }
        // Implementation for inserting a new seminar lottery
        const createdLottery = await this.lotterySeminarRepository.insert(params.lottery);
        return createdLottery;
    }

    async deleteSeminarLottery(id: number): Promise<boolean> {
        const seminarLottery = await this.lotterySeminarRepository.fetch({ id });
        if (!seminarLottery) {
            throw new BadRequestException("Seminar lottery not found");
        }
        // Implementation for deleting seminar lottery data
        return await this.lotterySeminarRepository.delete(id);
    }

    async drawSeminarLottery(id: number): Promise<void> {
        const seminarLottery = await this.lotterySeminarRepository.fetch({ id });
        if (!seminarLottery) {
            throw new BadRequestException("Seminar lottery not found");
        }
        // Implementation for drawing seminar lottery
        await this.lotterySeminarRepository.update(id, { lotteryWin: 1 });
    }

    async getSeminarLotteryTimeSlotCounts(param: { spaceId: number; infoId: number }): Promise<{ time: number; count: number }[]> {
        // 모든 시간대에 대해 신청한 조직 수 반환
        return await this.lotterySeminarRepository.fetchTimeSlotCounts(param.spaceId, param.infoId);
    }

    async getDrawnSeminarLottery(param: { spaceId: number; infoId: number }): Promise<MSeminarLottery[]> {
        return await this.lotterySeminarRepository.fetch({
            spaceId: param.spaceId,
            infoId: param.infoId,
            lotteryWin: 1
        });
    }

    // @Cron(CronExpression.EVERY_DAY_AT_6PM, { name: "drawing" })
    @Cron(CronExpression.EVERY_30_SECONDS, { name: "test" })
    async drawing() {
        const activeLottery = await this.lotterySeminarInfoRepository.fetchActiveLotteries(getNow());
        if (!activeLottery) {
            throw new BadRequestException("No active lottery found");
        }

        Logger.log("Drawing seminar lottery...");
        const seminarRooms = await this.spacePublicService.fetchAllBySpaceType(SpaceTypeEnum.SEMINAR);
        const verifiedOrganizations = await this.organizationPublicService.fetchVerified();

        seminarRooms.map(s => s.id).forEach(async (spaceId) => {
            Array.from({ length: 168 }).forEach(async (_, j) => {
                const lotteries = await this.getSeminarLotteryByTime({ time: j, spaceId, infoId: activeLottery[0].id });

                Logger.log(`Found ${lotteries.length} lotteries for time ${j}, space ${spaceId}`);
                // Implementation for drawing the lottery
                if (lotteries.length === 0) {
                    return;
                }

                if (lotteries.length === 1) {
                    if (lotteries[0].lotteryWin === 1) return;

                    await this.drawSeminarLottery(lotteries[0].id);
                    return;
                }

                const lotteriesWithOrg = lotteries.map(lottery => ({
                    ...lottery,
                    organization: verifiedOrganizations.find(org => org.id === lottery.organizationId)
                }));

                Logger.log(JSON.stringify(lotteriesWithOrg, null, 2));

                const hasRoomLotteries = lotteriesWithOrg.filter(lottery => lottery.organization!.hasRoom);
                const hasNoRoomLotteries = lotteriesWithOrg.filter(lottery => !lottery.organization!.hasRoom);

                Logger.log(`Has room lotteries: ${hasRoomLotteries.length}, Has no room lotteries: ${hasNoRoomLotteries.length}`);

                let winner = 0;
                if (hasRoomLotteries.length > 0) {
                    winner = hasRoomLotteries[getRandomIndex(hasRoomLotteries.length)].id;
                    await this.drawSeminarLottery(winner);
                } else {
                    winner = hasNoRoomLotteries[getRandomIndex(hasNoRoomLotteries.length)].id;
                    await this.drawSeminarLottery(winner);
                }
                Logger.log(`Winner drawn: ${winner}`);

                lotteries.forEach(async lottery => {
                    if (lottery.id !== winner) {
                        await this.deleteSeminarLottery(lottery.id);
                    }
                });
            });
        });
        Logger.log("Seminar lottery drawing completed");
    }
}