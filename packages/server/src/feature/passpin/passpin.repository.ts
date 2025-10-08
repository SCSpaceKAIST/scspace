import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Passpin, schema } from "@schema";
import { and, count, desc, eq } from "drizzle-orm";
import { PasspinEnum } from '@scspace-depot/enums/passpin.enum';
import { IPasspin, IPasspinSpace } from "@scspace-depot/types/passpin";
import { MPasspin, MPasspinSpace } from "@scspace-server/feature/passpin/passpin.model";
import { getNow } from "@scspace-server/common/utils";

@Injectable()
export class PasspinRepository {
    constructor(
        @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
    ) { }

    isValidString(val: string): boolean {
        if (val.length !== 6) return false;
        return /^d{6}$/.test(val);
    }

    async fetch(id: number): Promise<IPasspin> {
        const pin = await this.db
            .select()
            .from(Passpin)
            .where(eq(Passpin.id, id))
            .then((pins) => pins[0]);

        if (!pin) {
            throw new NotFoundException(`Passpin with id ${id} not found`);
        }

        return MPasspin.fromDB(pin);
    }

    async fetchSpacepin(spaceId: number): Promise<IPasspinSpace> {
        const current_pin = await this.db
            .select()
            .from(Passpin)
            .where(and(eq(Passpin.spaceId, spaceId), eq(Passpin.status, 0)))
            .then((pins) => pins[0]);

        if (!current_pin) {
            throw new NotFoundException(`Passpin with spaceId ${spaceId} & Stauts = 0 not found`);
        }

        const previous_pin = await this.db
            .select()
            .from(Passpin)
            .where(and(eq(Passpin.spaceId, spaceId), eq(Passpin.status, -1)))
            .orderBy(desc(Passpin.id))
            .limit(1)
            .then((pins) => pins[0]);

        if (!previous_pin) {
            return MPasspinSpace.fromDB(current_pin);
        }
        return MPasspinSpace.fromDB(current_pin, previous_pin);
    }

    async fetchDetailed(spaceId: number, status: number): Promise<IPasspin> {
        const pin = await this.db
            .select()
            .from(Passpin)
            .where(and(eq(Passpin.spaceId, spaceId), eq(Passpin.status, status)))
            .then((pins) => pins);
        if (!pin) {
            throw new NotFoundException(`Passpin with spaceId ${spaceId} & Stauts = ${status} not found`);
        }

        if (pin[1]) {
            throw new BadRequestException(`Passpin with spaceId ${spaceId} & Stauts = ${status} is not unique`);
        }

        return MPasspin.fromDB(pin[0]);
    }

    async updateStatus(id: number, status: number): Promise<boolean> {
        const [result] = await this.db
            .update(Passpin)
            .set({ status: status })
            .where(eq(Passpin.id, id));

        return result.affectedRows > 0;
    }

    async checkAvail(spaceId: number): Promise<boolean> {
        const results = await this.db
            .select({
                status: Passpin.status,
                cnt: count(),
            })
            .from(Passpin)
            .where(eq(Passpin.spaceId, spaceId))
            .groupBy(Passpin.status);

        const currentCount = results.find(r => r.status === PasspinEnum.USING)?.cnt ?? 0;

        if (currentCount !== 1) {
            throw new BadRequestException(
                `Invalid passpin state: expected exactly 1 USING pin, got ${currentCount}`
            );
        }

        return true; // 정상
    }


    /**
     *
     * @param spaceId
     * @param pin
     * @param status
     */
    async createPin(spaceId: number, pin: string, status?: number): Promise<IPasspin> {
        if (!this.isValidString(pin)) {
            throw new BadRequestException(`Invalid String for Passpin : ${pin}`);
        }

        if (status !== PasspinEnum.OUTDATED && status !== PasspinEnum.USING) {
            throw new BadRequestException(`Invalid pin status : ${status}`)
        }

        const [res] = await this.db
            .insert(Passpin)
            .values({
                spaceId: spaceId,
                pin: pin,
                status: status ?? PasspinEnum.USING,
                timeCreated: getNow(),
            });

        if (!res.insertId) {
            throw new Error("something went wrong : new password generation")
        }

        const inserted = await this.fetch(res.insertId);
        if (!inserted) throw new Error("something went wrong : new password generation")

        return await this.fetch(res.insertId)
    }

    async fetchOlderPins(spaceId: number, limit: number, includeCurrent?: boolean): Promise<IPasspin[]> {
        const pins = await this.db
            .select()
            .from(Passpin)
            .where(and(eq(Passpin.spaceId, spaceId), eq(Passpin.status, PasspinEnum.OUTDATED)))
            .orderBy(desc(Passpin.id))
            .limit(limit)
        const res: IPasspin[] = pins.map(pin => MPasspin.fromDB(pin));
        if (includeCurrent) {
            const currentPin = await this.fetchDetailed(spaceId, PasspinEnum.USING);
            res.unshift(currentPin);
            res.pop(); //then the total length = limit !
        }
        return res;
    }


    /** OUTDATED
     *     async createPin(spaceId: number, pin: string, status?: number) : Promise<IPasspin> {
     *         if (!this.fetchDetailed(spaceId, PasspinEnum.NEXT).then(pin => pin[0])) {
     *             throw new BadRequestException(`Pin already exists`);
     *         }
     *
     *         // !!!! getNow() 사용하는게 맞는지 확인 필요함 !!!
     *
     *         const [result] = await this.db
     *             .update(Passpin)
     *             .set({
     *                 status : status ?? PasspinEnum.NEXT,
     *                 pin : pin.toString(),
     *                 timeCreated : getNow(),
     *             })
     *             .where(eq(Passpin.spaceId, spaceId));
     *
     *         const generatedPin = await this.fetch(result.insertId);
     *         if (!generatedPin) {
     *             throw new Error ("something went wrong : new password generation")
     *         }
     *
     *         return generatedPin;
     *     }
     */


}