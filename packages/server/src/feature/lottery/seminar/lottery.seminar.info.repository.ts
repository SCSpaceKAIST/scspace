import { Inject, Injectable } from "@nestjs/common";
import { ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery";
import { DBAsyncProvider } from "@scspace-server/db/db.provider";
import { schema, SeminarLotteryInfo } from "@scspace-server/db/schema";
import { eq, InferInsertModel, asc, lte, gte, gt, and } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { MSeminarLotteryInfo } from "@scspace-server/feature/lottery/seminar/lottery.seminar.info.model";

@Injectable()
export class LotterySeminarInfoRepository {
    constructor(
        @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>
    ) { }

    async fetch(params: { id: number }): Promise<MSeminarLotteryInfo> {
        // Implementation for fetching seminar lottery data
        // This is a placeholder, actual implementation will depend on the schema and requirements
        const result = await this.db
            .select()
            .from(SeminarLotteryInfo)
            .where(
                eq(SeminarLotteryInfo.id, params.id)
            );
        if (result.length === 0) {
            throw new Error("Seminar lottery info not found");
        }
        return result[0];
    }

    async fetchAll(): Promise<MSeminarLotteryInfo[]> {
        // 추첨 시작 시간 순으로 정렬하여 모든 세미나 추첨 정보 조회
        const result = await this.db
            .select()
            .from(SeminarLotteryInfo)
            .orderBy(asc(SeminarLotteryInfo.timeLotteryStart));
        return result;
    }

    async insert(lotteryInfo: ILotteryInfoCreate): Promise<MSeminarLotteryInfo> {
        // 새 추첨 정보 삽입
        const [result] = await this.db
            .insert(SeminarLotteryInfo)
            .values(lotteryInfo as InferInsertModel<typeof SeminarLotteryInfo>);

        if (!result.insertId) {
            throw new Error("Failed to insert seminar lottery info");
        }

        // 삽입된 데이터 조회하여 반환
        const seminarLotteryInfoCreated = await this.fetch({ id: result.insertId });
        if (!seminarLotteryInfoCreated) {
            throw new Error("Created seminar lottery info not found");
        }

        return seminarLotteryInfoCreated;
    }

    async update({ id, updateLotteryInfo }: {
        id: number;
        updateLotteryInfo: ILotteryInfoUpdate;
    }): Promise<MSeminarLotteryInfo> {
        // 추첨 정보 업데이트
        const [result] = await this.db
            .update(SeminarLotteryInfo)
            .set(updateLotteryInfo as InferInsertModel<typeof SeminarLotteryInfo>)
            .where(eq(SeminarLotteryInfo.id, id));

        if (!result.affectedRows) {
            throw new Error("Failed to update seminar lottery info");
        }

        // 업데이트된 데이터 조회하여 반환
        return this.fetch({ id });
    }

    async delete(id: number): Promise<boolean> {
        // 추첨 정보 삭제
        const [result] = await this.db
            .delete(SeminarLotteryInfo)
            .where(eq(SeminarLotteryInfo.id, id));

        return result.affectedRows > 0;
    }

    /**
     * 추첨 시작 시간을 기준으로 정렬된 활성 추첨 정보들을 조회
     * @param currentTime 현재 시간 (timestamp)
     * @returns 현재 진행 중인 추첨 정보들 (추첨 시작 시간 순으로 정렬)
     */
    async fetchActiveLotteries(currentTime: number): Promise<MSeminarLotteryInfo[]> {
        const result = await this.db
            .select()
            .from(SeminarLotteryInfo)
            .where(
                and(
                    lte(SeminarLotteryInfo.timeLotteryStart, currentTime),
                    gte(SeminarLotteryInfo.timeEnd, currentTime)
                )
            )
            .orderBy(asc(SeminarLotteryInfo.timeLotteryStart));
        return result;
    }

    /**
     * 예정된 추첨 정보들을 조회
     * @param currentTime 현재 시간 (timestamp)
     * @returns 예정된 추첨 정보들 (추첨 시작 시간 순으로 정렬)
     */
    async fetchUpcomingLotteries(currentTime: number): Promise<MSeminarLotteryInfo[]> {
        const result = await this.db
            .select()
            .from(SeminarLotteryInfo)
            .where(gt(SeminarLotteryInfo.timeLotteryStart, currentTime))
            .orderBy(asc(SeminarLotteryInfo.timeLotteryStart));
        return result;
    }
}