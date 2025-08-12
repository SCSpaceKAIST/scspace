import { Inject, Injectable } from "@nestjs/common";
import { DBAsyncProvider } from "@scspace-server/db/db.provider";
import { schema, SeminarLottery } from "@scspace-server/db/schema";
import { and, eq, InferInsertModel, SQL, count } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { MSeminarLottery } from "./lottery.seminar.model";
import { ISeminarLotteryCreate, ISeminarLotteryFetch, ISeminarLotteryUpdateAdmin } from "@scspace-depot/types/lottery";
import { getNow } from "@scspace-server/common/utils";

@Injectable()
export class LotterySeminarRepository {
    constructor(
        @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>
    ) { }

    async fetch(params: ISeminarLotteryFetch): Promise<MSeminarLottery[]> {
        const whereClause: SQL[] = [];
        if (params.id) {
            whereClause.push(eq(SeminarLottery.id, params.id));
        }
        if (params.organizationId) {
            whereClause.push(eq(SeminarLottery.organizationId, params.organizationId));
        }
        if (params.spaceId) {
            whereClause.push(eq(SeminarLottery.spaceId, params.spaceId));
        }
        if (params.infoId) {
            whereClause.push(eq(SeminarLottery.infoId, params.infoId));
        }
        if (params.time !== undefined) {
            whereClause.push(eq(SeminarLottery.time, params.time));
        }
        if (params.lotteryWin !== undefined) {
            whereClause.push(eq(SeminarLottery.lotteryWin, params.lotteryWin));
        }

        // Implementation for fetching seminar lottery data
        const result = await this.db
            .select()
            .from(SeminarLottery)
            .where(and(...whereClause));
        return result;
    }

    async fetchAll(): Promise<MSeminarLottery[]> {
        // Implementation for fetching all seminar lottery data
        const result = await this.db
            .select()
            .from(SeminarLottery);
        return result;
    }

    async fetchTimeSlotCounts(spaceId: number, infoId: number): Promise<{ time: number; count: number }[]> {
        // Implementation for fetching organization count per time slot
        const result = await this.db
            .select({
                time: SeminarLottery.time,
                count: count(SeminarLottery.organizationId).as('count')
            })
            .from(SeminarLottery)
            .where(and(
                eq(SeminarLottery.spaceId, spaceId),
                eq(SeminarLottery.infoId, infoId)
            ))
            .groupBy(SeminarLottery.time);

        return result.map(row => ({
            time: row.time,
            count: Number(row.count)
        }));
    }

    async insert(lottery: ISeminarLotteryCreate): Promise<MSeminarLottery> {
        // Implementation for inserting seminar lottery data
        const [result] = await this.db
            .insert(SeminarLottery)
            .values({
                ...lottery,
                timeUpdate: getNow()
            } as InferInsertModel<typeof SeminarLottery>);
        if (!result.insertId) {
            throw new Error("Failed to insert seminar lottery");
        }
        const seminarLotteryCreated = await this.fetch({ id: result.insertId });
        if (!seminarLotteryCreated) {
            throw new Error("Created seminar lottery not found");
        }
        return seminarLotteryCreated[0];
    }

    async update(id: number, lotteryUpdate: ISeminarLotteryUpdateAdmin): Promise<MSeminarLottery> {
        // Implementation for updating seminar lottery data
        const [result] = await this.db
            .update(SeminarLottery)
            .set(lotteryUpdate)
            .where(eq(SeminarLottery.id, id));
        if (!result.affectedRows) {
            throw new Error("Failed to update seminar lottery");
        }
        const seminarLotteryUpdated = await this.fetch({ id });
        if (!seminarLotteryUpdated) {
            throw new Error("Updated seminar lottery not found");
        }
        return seminarLotteryUpdated[0];
    }

    async delete(id: number): Promise<boolean> {
        // Implementation for deleting seminar lottery data
        const [result] = await this.db
            .delete(SeminarLottery)
            .where(eq(SeminarLottery.id, id));
        return result.affectedRows > 0;
    }

    async deleteAllLosenLotteries(): Promise<void> {
        // Implementation for deleting all lost seminar lotteries
        await this.db
            .delete(SeminarLottery)
            .where(eq(SeminarLottery.lotteryWin, 0));
    }
}
