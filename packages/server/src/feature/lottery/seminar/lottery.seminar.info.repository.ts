import { Inject, Injectable } from "@nestjs/common";
import { ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery";
import { DBAsyncProvider } from "@scspace-server/db/db.provider";
import { schema, SeminarLotteryInfo } from "@scspace-server/db/schema";
import { eq } from "drizzle-orm";
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
        // Implementation for fetching all seminar lottery data
        // This is a placeholder, actual implementation will depend on the schema and requirements
        const result = await this.db
            .select()
            .from(SeminarLotteryInfo);
        return result;
    }

    async insert(lotteryInfo: ILotteryInfoCreate): Promise<MSeminarLotteryInfo> {
        // Implementation for inserting seminar lottery data
        // This is a placeholder, actual implementation will depend on the schema and requirements
        const [result] = await this.db.insert(SeminarLotteryInfo).values(lotteryInfo);
        if (!result.insertId) {
            throw new Error("Failed to insert seminar lottery info");
        }
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
        // Implementation for updating seminar lottery data
        // This is a placeholder, actual implementation will depend on the schema and requirements
        const [result] = await this.db
            .update(SeminarLotteryInfo)
            .set(updateLotteryInfo)
            .where(eq(SeminarLotteryInfo.id, id));
        if (!result.affectedRows) {
            throw new Error("Failed to update seminar lottery info");
        }
        return this.fetch({ id });
    }

    async delete(id: number): Promise<boolean> {
        // Implementation for deleting seminar lottery data
        // This is a placeholder, actual implementation will depend on the schema and requirements
        const [result] = await this.db
            .delete(SeminarLotteryInfo)
            .where(eq(SeminarLotteryInfo.id, id));
        return result.affectedRows > 0;
    }
}