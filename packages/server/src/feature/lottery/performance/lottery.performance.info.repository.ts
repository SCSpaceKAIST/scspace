import { Inject, Injectable } from "@nestjs/common";
import { ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery";
import { DBAsyncProvider } from "@scspace-server/db/db.provider";
import { schema, PerformanceLotteryInfo } from "@scspace-server/db/schema";
import { eq, InferInsertModel, asc, lte, gte, gt, and } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { MPerformanceLotteryInfo } from "@scspace-server/feature/lottery/performance/lottery.performance.info.model";

@Injectable()
export class LotteryPerformanceInfoRepository {
    constructor(
        @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>
    ) { }

    async fetch(params: { id: number }): Promise<MPerformanceLotteryInfo> {
        // Implementation for fetching performance lottery data
        // This is a placeholder, actual implementation will depend on the schema and requirements
        const result = await this.db
            .select()
            .from(PerformanceLotteryInfo)
            .where(
                eq(PerformanceLotteryInfo.id, params.id)
            );
        if (result.length === 0) {
            throw new Error("Performance lottery info not found");
        }
        return result[0];
    }

    async fetchAll(): Promise<MPerformanceLotteryInfo[]> {
        // 추첨 시작 시간 순으로 정렬하여 모든 공연 추첨 정보 조회
        const result = await this.db
            .select()
            .from(PerformanceLotteryInfo)
            .orderBy(asc(PerformanceLotteryInfo.timeLotteryStart));
        return result;
    }

    async insert(lotteryInfo: ILotteryInfoCreate): Promise<MPerformanceLotteryInfo> {
        // 새 추첨 정보 삽입
        const [result] = await this.db
            .insert(PerformanceLotteryInfo)
            .values(lotteryInfo as InferInsertModel<typeof PerformanceLotteryInfo>);

        if (!result.insertId) {
            throw new Error("Failed to insert performance lottery info");
        }

        // 삽입된 데이터 조회하여 반환
        const performanceLotteryInfoCreated = await this.fetch({ id: result.insertId });
        if (!performanceLotteryInfoCreated) {
            throw new Error("Created performance lottery info not found");
        }

        return performanceLotteryInfoCreated;
    }

    async update({ id, updateLotteryInfo }: {
        id: number;
        updateLotteryInfo: ILotteryInfoUpdate;
    }): Promise<MPerformanceLotteryInfo> {
        // 추첨 정보 업데이트
        const [result] = await this.db
            .update(PerformanceLotteryInfo)
            .set(updateLotteryInfo as InferInsertModel<typeof PerformanceLotteryInfo>)
            .where(eq(PerformanceLotteryInfo.id, id));

        if (!result.affectedRows) {
            throw new Error("Failed to update performance lottery info");
        }

        // 업데이트된 데이터 조회하여 반환
        return this.fetch({ id });
    }

    async delete(id: number): Promise<boolean> {
        // 추첨 정보 삭제
        const [result] = await this.db
            .delete(PerformanceLotteryInfo)
            .where(eq(PerformanceLotteryInfo.id, id));

        return result.affectedRows > 0;
    }

    /**
     * 추첨 시작 시간을 기준으로 정렬된 활성 추첨 정보들을 조회
     * @param currentTime 현재 시간 (timestamp)
     * @returns 현재 진행 중인 추첨 정보들 (추첨 시작 시간 순으로 정렬)
     */
    async fetchActiveLotteries(currentTime: number): Promise<MPerformanceLotteryInfo[]> {
        const result = await this.db
            .select()
            .from(PerformanceLotteryInfo)
            .where(
                and(
                    lte(PerformanceLotteryInfo.timeLotteryStart, currentTime),
                    gte(PerformanceLotteryInfo.timeEnd, currentTime)
                )
            )
            .orderBy(asc(PerformanceLotteryInfo.timeLotteryStart));
        return result;
    }

    /**
     * 예정된 추첨 정보들을 조회
     * @param currentTime 현재 시간 (timestamp)
     * @returns 예정된 추첨 정보들 (추첨 시작 시간 순으로 정렬)
     */
    async fetchUpcomingLotteries(currentTime: number): Promise<MPerformanceLotteryInfo[]> {
        const result = await this.db
            .select()
            .from(PerformanceLotteryInfo)
            .where(gt(PerformanceLotteryInfo.timeLotteryStart, currentTime))
            .orderBy(asc(PerformanceLotteryInfo.timeLotteryStart));
        return result;
    }
}
