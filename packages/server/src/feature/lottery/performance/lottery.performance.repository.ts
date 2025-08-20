import { Inject, Injectable } from "@nestjs/common";
import { DBAsyncProvider } from "@scspace-server/db/db.provider";
import { schema, PerformanceLottery } from "@scspace-server/db/schema";
import { and, eq, InferInsertModel, SQL, count } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { MPerformanceLottery } from "./lottery.performance.model";
import { IPerformanceLotteryCreate, IPerformanceLotteryFetch, IPerformanceLotteryUpdateAdmin } from "@scspace-depot/types/lottery";
import { getNow } from "@scspace-server/common/utils";

@Injectable()
export class LotteryPerformanceRepository {
    constructor(
        @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>
    ) { }

    async fetch(params: IPerformanceLotteryFetch): Promise<MPerformanceLottery[]> {
        const whereClause: SQL[] = [];
        if (params.id) {
            whereClause.push(eq(PerformanceLottery.id, params.id));
        }
        if (params.organizationId) {
            whereClause.push(eq(PerformanceLottery.organizationId, params.organizationId));
        }
        if (params.spaceId) {
            whereClause.push(eq(PerformanceLottery.spaceId, params.spaceId));
        }
        if (params.infoId) {
            whereClause.push(eq(PerformanceLottery.infoId, params.infoId));
        }
        if (params.date !== undefined) {
            whereClause.push(eq(PerformanceLottery.date, params.date));
        }
        if (params.priority !== undefined) {
            whereClause.push(eq(PerformanceLottery.priority, params.priority));
        }
        if (params.lotteryWin !== undefined) {
            whereClause.push(eq(PerformanceLottery.lotteryWin, params.lotteryWin));
        }

        // Implementation for fetching performance lottery data
        const result = await this.db
            .select()
            .from(PerformanceLottery)
            .where(and(...whereClause));
        return result;
    }

    async fetchAll(): Promise<MPerformanceLottery[]> {
        // Implementation for fetching all performance lottery data
        const result = await this.db
            .select()
            .from(PerformanceLottery);
        return result;
    }

    async fetchDateSlotCounts(spaceId: number, infoId: number): Promise<{ date: number; count: [number, number, number] }[]> {
        // Implementation for fetching organization count per date slot by priority
        const result = await this.db
            .select({
                date: PerformanceLottery.date,
                priority: PerformanceLottery.priority,
                count: count(PerformanceLottery.organizationId).as('count')
            })
            .from(PerformanceLottery)
            .where(and(
                eq(PerformanceLottery.spaceId, spaceId),
                eq(PerformanceLottery.infoId, infoId)
            ))
            .groupBy(PerformanceLottery.date, PerformanceLottery.priority);

        // Group by date and create array for each priority [priority1, priority2, priority3]
        const dateCountMap = new Map<number, [number, number, number]>();

        result.forEach(row => {
            const date = row.date;
            const priority = row.priority;
            const count = Number(row.count);

            if (!dateCountMap.has(date)) {
                dateCountMap.set(date, [0, 0, 0]);
            }

            const counts = dateCountMap.get(date)!;
            if (priority >= 1 && priority <= 3) {
                counts[priority - 1] = count;
            }
        });

        return Array.from(dateCountMap.entries()).map(([date, count]) => ({
            date,
            count
        }));
    }

    async insert(lottery: IPerformanceLotteryCreate): Promise<MPerformanceLottery> {
        // Implementation for inserting performance lottery data
        const [result] = await this.db
            .insert(PerformanceLottery)
            .values({
                ...lottery,
                timeUpdate: getNow()
            } as InferInsertModel<typeof PerformanceLottery>);
        if (!result.insertId) {
            throw new Error("Failed to insert performance lottery");
        }
        const performanceLotteryCreated = await this.fetch({ id: result.insertId });
        if (!performanceLotteryCreated) {
            throw new Error("Created performance lottery not found");
        }
        return performanceLotteryCreated[0];
    }

    async update(id: number, lotteryUpdate: IPerformanceLotteryUpdateAdmin): Promise<MPerformanceLottery> {
        // Implementation for updating performance lottery data
        const [result] = await this.db
            .update(PerformanceLottery)
            .set(lotteryUpdate)
            .where(eq(PerformanceLottery.id, id));
        if (!result.affectedRows) {
            throw new Error("Failed to update performance lottery");
        }
        const performanceLotteryUpdated = await this.fetch({ id });
        if (!performanceLotteryUpdated) {
            throw new Error("Updated performance lottery not found");
        }
        return performanceLotteryUpdated[0];
    }

    async delete(id: number): Promise<boolean> {
        // Implementation for deleting performance lottery data
        const [result] = await this.db
            .delete(PerformanceLottery)
            .where(eq(PerformanceLottery.id, id));
        return result.affectedRows > 0;
    }

    async deleteAllLosenLotteries(): Promise<void> {
        // Implementation for deleting all lost performance lotteries
        await this.db
            .delete(PerformanceLottery)
            .where(eq(PerformanceLottery.lotteryWin, 0));
    }
}
