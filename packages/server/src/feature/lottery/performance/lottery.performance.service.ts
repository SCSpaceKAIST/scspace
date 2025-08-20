import { BadRequestException, forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { OrganizationPublicService } from "@scspace-server/feature/organization/organization.public.service";
import { LotteryPerformanceRepository } from "./lottery.performance.repository";
import { LotteryPerformanceInfoRepository } from "./lottery.performance.info.repository";
import { MPerformanceLottery } from "./lottery.performance.model";

import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";
import {
    ILotteryInfoCreate,
    ILotteryInfoUpdate,
    IPerformanceLotteryCreate,
} from "@scspace-depot/types/lottery";
import { getDate, getDateBegin, getDateEnd, getNow, getRandomIndex } from "@scspace-server/common/utils";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SpacePublicService } from "@scspace-server/feature/space/space.public.service";
import { SpaceTypeEnum } from "@scspace-depot/enums/space.enum";
import { MPerformanceLotteryInfo } from "./lottery.performance.info.model";

@Injectable()
export class LotteryPerformanceService {
    // This service will handle the data access for performance lottery-related operations
    constructor(
        private readonly organizationPublicService: OrganizationPublicService,
        private readonly spacePublicService: SpacePublicService,
        private readonly lotteryPerformanceRepository: LotteryPerformanceRepository,
        private readonly lotteryPerformanceInfoRepository: LotteryPerformanceInfoRepository
    ) { }

    async getAllPerformanceLotteryInfo(): Promise<MPerformanceLotteryInfo[]> {
        // 자동 정렬된 모든 공연 추첨 정보 조회
        const performanceLotteryInfo = await this.lotteryPerformanceInfoRepository.fetchAll();
        return performanceLotteryInfo;
    }

    async getActivePerformanceLotteryInfo(): Promise<MPerformanceLotteryInfo[]> {
        // 현재 진행 중인 추첨 정보들 조회 (시간 순 정렬)
        const now = getNow();
        return await this.lotteryPerformanceInfoRepository.fetchActiveLotteries(now);
    }

    async getUpcomingPerformanceLotteryInfo(): Promise<MPerformanceLotteryInfo[]> {
        // 예정된 추첨 정보들 조회 (시간 순 정렬)
        const now = getNow();
        return await this.lotteryPerformanceInfoRepository.fetchUpcomingLotteries(now);
    }

    /**
     * 시간 겹침 검증 - 추첨 시작 시간부터 행사 끝 시간까지 겹치는지 확인
     */
    private async validateTimeConflict(
        lotteryInfo: { timeLotteryStart: number; timeEnd: number },
        excludeId?: number
    ): Promise<void> {
        const allLotteries = await this.lotteryPerformanceInfoRepository.fetchAll();

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
            const isOverlapping = !(newEndTime <= existingStartTime || newStartTime >= existingEndTime);

            if (isOverlapping) {
                throw new BadRequestException(
                    `Time conflict detected. The period from lottery start to event end overlaps with existing lottery (ID: ${existingLottery.id})`
                );
            }
        }
    }

    async postPerformanceLotteryInfo(params: {
        lotteryInfo: ILotteryInfoCreate
    }): Promise<MPerformanceLotteryInfo> {
        const now = getNow();

        // 시간 유효성 검증
        // if (params.lotteryInfo.timeLotteryStart < now) {
        //     throw new BadRequestException("Lottery time cannot be in the past");
        // }
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
        const createdLotteryInfo = await this.lotteryPerformanceInfoRepository.insert({
            timeStart: getDateBegin(params.lotteryInfo.timeStart),
            timeEnd: getDateEnd(params.lotteryInfo.timeEnd),
            timeLotteryStart: getDateBegin(params.lotteryInfo.timeLotteryStart),
            timeLotteryEnd: getDateEnd(params.lotteryInfo.timeLotteryEnd)
        });
        return createdLotteryInfo;
    }

    async updatePerformanceLotteryInfo(params: {
        id: number;
        updateLotteryInfo: ILotteryInfoUpdate;
    }): Promise<MPerformanceLotteryInfo> {
        const performanceLotteryInfo = await this.lotteryPerformanceInfoRepository.fetch({
            id: params.id
        });
        if (!performanceLotteryInfo) {
            throw new BadRequestException("Performance lottery info not found");
        }

        const now = getNow();

        // 업데이트할 값들을 기존 값과 병합
        const mergedLotteryInfo = {
            timeLotteryStart: params.updateLotteryInfo.timeLotteryStart ?? performanceLotteryInfo.timeLotteryStart,
            timeLotteryEnd: params.updateLotteryInfo.timeLotteryEnd ?? performanceLotteryInfo.timeLotteryEnd,
            timeStart: params.updateLotteryInfo.timeStart ?? performanceLotteryInfo.timeStart,
            timeEnd: params.updateLotteryInfo.timeEnd ?? performanceLotteryInfo.timeEnd,
        };

        // 시간 유효성 검증
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
        const updatedLotteryInfo = await this.lotteryPerformanceInfoRepository.update(params);
        return updatedLotteryInfo;
    }

    async deletePerformanceLotteryInfo(id: number): Promise<boolean> {
        const performanceLotteryInfo = await this.lotteryPerformanceInfoRepository.fetch({ id });
        if (!performanceLotteryInfo) {
            throw new BadRequestException("Performance lottery info not found");
        }
        return await this.lotteryPerformanceInfoRepository.delete(id);
    }

    async getPerformanceLotteryByOrganization(params: {
        organizationId: number;
        spaceId: number;
        infoId: number;
    }): Promise<MPerformanceLottery[]> {
        return this.lotteryPerformanceRepository.fetch(params);
    }

    async getPerformanceLotteryByDate(params: {
        date: number;
        spaceId: number;
        infoId: number;
    }): Promise<MPerformanceLottery[]> {
        return this.lotteryPerformanceRepository.fetch(params);
    }

    async postPerformanceLottery(params: {
        lottery: IPerformanceLotteryCreate
    }): Promise<MPerformanceLottery> {
        const organization = await this.organizationPublicService.fetchById(params.lottery.organizationId);
        if (!organization) {
            throw new BadRequestException("Organization not found");
        }
        if (organization.status !== OrganizationStatusEnum.VERIFIED) {
            throw new BadRequestException("Only verified organizations can create performance lotteries");
        }

        const activeLottery = await this.lotteryPerformanceInfoRepository.fetchActiveLotteries(getNow());
        if (activeLottery.length === 0 || activeLottery[0].id !== params.lottery.infoId) {
            throw new BadRequestException("Active lottery not found");
        }

        const drawnLotteries = await this.lotteryPerformanceRepository.fetch({
            spaceId: params.lottery.spaceId,
            date: params.lottery.date,
            infoId: params.lottery.infoId,
            lotteryWin: 1
        });
        if (drawnLotteries.length > 0) {
            throw new BadRequestException("A performance lottery with the same date has already been drawn.");
        }

        const pastLotteries = await this.lotteryPerformanceRepository.fetch({
            organizationId: params.lottery.organizationId,
            infoId: params.lottery.infoId
        });
        if (pastLotteries.find(lottery => lottery.date === params.lottery.date)) {
            throw new BadRequestException("A performance lottery with the same date already exists.");
        }

        // 공연집중기간은 최대 신청 수 제한이 다를 수 있음 (일단 10개로 설정)
        if (pastLotteries.length >= 10) {
            throw new BadRequestException("Maximum number of performance lotteries is 10. Cannot create more.");
        }

        const createdLottery = await this.lotteryPerformanceRepository.insert(params.lottery);
        return createdLottery;
    }

    async deletePerformanceLottery(id: number): Promise<boolean> {
        const performanceLottery = await this.lotteryPerformanceRepository.fetch({ id });
        if (!performanceLottery) {
            throw new BadRequestException("Performance lottery not found");
        }
        return await this.lotteryPerformanceRepository.delete(id);
    }

    async drawPerformanceLottery(id: number): Promise<void> {
        const performanceLottery = await this.lotteryPerformanceRepository.fetch({ id });
        if (!performanceLottery) {
            throw new BadRequestException("Performance lottery not found");
        }
        await this.lotteryPerformanceRepository.update(id, { lotteryWin: 1 });
    }

    async getPerformanceLotteryDateSlotCounts(param: { spaceId: number; infoId: number }): Promise<{ date: number; count: number }[]> {
        // 모든 날짜에 대해 신청한 조직 수 반환
        return await this.lotteryPerformanceRepository.fetchDateSlotCounts(param.spaceId, param.infoId);
    }

    async getDrawnPerformanceLottery(param: { spaceId: number; infoId: number }): Promise<MPerformanceLottery[]> {
        return await this.lotteryPerformanceRepository.fetch({
            spaceId: param.spaceId,
            infoId: param.infoId,
            lotteryWin: 1
        });
    }

    async applyPerformanceLottery(): Promise<boolean> {
        const activeLottery = await this.lotteryPerformanceInfoRepository.fetchActiveLotteries(getNow());
        if (!activeLottery || activeLottery.length === 0) {
            throw new BadRequestException("No active lottery found");
        }
        if (activeLottery[0].applied) {
            throw new BadRequestException("You have already applied for this lottery");
        }

        // 공연 추첨 결과를 실제 예약으로 변환하는 로직 구현
        // TODO: 구체적인 공연 예약 생성 로직 구현 필요

        await this.lotteryPerformanceInfoRepository.update({
            id: activeLottery[0].id,
            updateLotteryInfo: { applied: true }
        });

        return true;
    }

    // Performance lottery drawing logic - 우선순위 기반으로 추첨
    // @Cron(CronExpression.EVERY_DAY_AT_6PM, { name: "performance_drawing" })
    async drawing() {
        const activeLottery = await this.lotteryPerformanceInfoRepository.fetchActiveLotteries(getNow());
        if (!activeLottery || activeLottery.length === 0) {
            return;
        }

        // DANCE, SUMI 등 공연실만 대상으로 (향후 PERFORMANCE 타입 추가되면 수정)
        const performanceRooms = await this.spacePublicService.fetchAllBySpaceType(SpaceTypeEnum.DANCE);
        const performanceRooms2 = await this.spacePublicService.fetchAllBySpaceType(SpaceTypeEnum.SUMI);
        const allPerformanceRooms = [...performanceRooms, ...performanceRooms2];

        const verifiedOrganizations = await this.organizationPublicService.fetchVerified();

        for (const room of allPerformanceRooms) {
            // 각 날짜별로 추첨 진행 (공연집중기간은 보통 며칠간 진행)
            const startDate = getDate(activeLottery[0].timeStart);
            const endDate = getDate(activeLottery[0].timeEnd);

            for (let currentDate = startDate.getTime(); currentDate <= endDate.getTime(); currentDate += 24 * 60 * 60 * 1000) {
                const dateTimestamp = Math.floor(currentDate / 1000);

                const drawnLotteries = await this.lotteryPerformanceRepository.fetch({
                    spaceId: room.id,
                    infoId: activeLottery[0].id,
                    date: dateTimestamp,
                    lotteryWin: 1
                });

                if (drawnLotteries.length > 0) continue; // 이미 당첨자가 있으면 스킵

                const lotteries = await this.lotteryPerformanceRepository.fetch({
                    spaceId: room.id,
                    infoId: activeLottery[0].id,
                    date: dateTimestamp,
                    lotteryWin: 0
                });

                if (lotteries.length === 0) continue;
                if (lotteries.length === 1) {
                    await this.drawPerformanceLottery(lotteries[0].id);
                    continue;
                }

                // 우선순위별로 정렬하여 추첨
                const lotteriesWithOrg = lotteries.map(lottery => ({
                    ...lottery,
                    organization: verifiedOrganizations.find(org => org.id === lottery.organizationId)
                }));

                // 우선순위가 높은 순서대로 정렬 (낮은 숫자가 높은 우선순위)
                lotteriesWithOrg.sort((a, b) => a.priority - b.priority);

                // 같은 우선순위 그룹에서 추첨
                const highestPriority = lotteriesWithOrg[0].priority;
                const highestPriorityLotteries = lotteriesWithOrg.filter(l => l.priority === highestPriority);

                const winner = highestPriorityLotteries[getRandomIndex(highestPriorityLotteries.length)];
                await this.drawPerformanceLottery(winner.id);

                Logger.log(`Performance lottery winner drawn: ${winner.id} for date ${dateTimestamp}`);

                // 나머지 신청 삭제
                for (const lottery of lotteries) {
                    if (lottery.id !== winner.id) {
                        await this.deletePerformanceLottery(lottery.id);
                    }
                }
            }
        }
    }
}
