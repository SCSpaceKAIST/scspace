import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Passpin, schema} from "@schema";
import { and, count, eq} from "drizzle-orm";
import { PasspinEnum } from '@scspace-depot/enums/passpin.enum';
import { IPasspin, IPasspinSpace } from "@scspace-depot/types/passpin";
import { MPasspin, MPasspinSpace } from "@scspace-server/feature/passpin/passpin.model";
import { getNow } from "@scspace-server/common/utils";

@Injectable()
export class PasspinRepository {
    constructor(
        @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
    ) {}

    //fetch with ID
    async fetch(id: number): Promise<IPasspin> {
        const pin  = await this.db
            .select()
            .from(Passpin)
            .where(eq(Passpin.id, id))
            .then((pins) => pins[0]);

        if (!pin) {
            throw new NotFoundException(`Passpin with id ${id} not found`);
        }

        return MPasspin.fromDB(pin);
    }


    async fetchSpacepin(spaceId : number) : Promise<IPasspinSpace> {
        const current_pin = await this.db
            .select()
            .from(Passpin)
            .where(and(eq(Passpin.spaceId, spaceId), eq(Passpin.status, 0)))
            .then((pins) => pins[0]);

        if (!current_pin) {
            throw new NotFoundException(`Passpin with spaceId ${spaceId} & Stauts = 0 not found`);
        }

        const next_pin = await this.db
            .select()
            .from(Passpin)
            .where(and(eq(Passpin.spaceId, spaceId), eq(Passpin.status, 1)))
            .then((pins) => pins[0]);


        if (!next_pin) {
            throw new NotFoundException(`Passpin with spaceId ${spaceId} & Stauts = 1 not found`);
        }

        return MPasspinSpace.fromDB(current_pin, next_pin);
    }

    async fetchDetailed (spaceId : number, status : number) :Promise<IPasspin> {
        const pin  = await this.db
            .select()
            .from(Passpin)
            .where(and(eq(Passpin.spaceId, spaceId), eq(Passpin.status, status)))
            .then((pins) => pins[0]);
        if (!pin) {
            throw new NotFoundException(`Passpin with spaceId ${spaceId} & Stauts = ${status} not found`);
        }

        return MPasspin.fromDB(pin);
    }

    async updateStatus(id: number,status : number) : Promise<boolean> {
        const [result] = await this.db
            .update(Passpin)
            .set({status : status})
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
        const nextCount    = results.find(r => r.status === PasspinEnum.NEXT)?.cnt ?? 0;

        if (currentCount !== 1) {
            throw new BadRequestException(
                `Invalid passpin state: expected exactly 1 USING pin, got ${currentCount}`
            );
        }
        if (nextCount !== 1) {
            throw new BadRequestException(
                `Invalid passpin state: expected exactly 1 NEXT pin, got ${nextCount}`
            );
        }

        return true; // 정상
    }


    //create NEXT pin for spaceId => Only after passpin Changed !!
    async createPin(spaceId: number, pin: string, status?: number) : Promise<IPasspin> {
        if (!this.fetchDetailed(spaceId, PasspinEnum.NEXT).then(pin => pin[0])) {
            throw new BadRequestException(`Pin already exists`);
        }

        // !!!! getNow() 사용하는게 맞는지 확인 필요함 !!!

        const [result] = await this.db
            .update(Passpin)
            .set({
                status : status ?? PasspinEnum.NEXT,
                pin : pin.toString(),
                timeCreated : getNow(),
            })
            .where(eq(Passpin.spaceId, spaceId));

        const generatedPin = await this.fetch(result.insertId);
        if (!generatedPin) {
            throw new Error ("something went wrong : new password generation")
        }

        return generatedPin;
    }

    //changesubmit



}