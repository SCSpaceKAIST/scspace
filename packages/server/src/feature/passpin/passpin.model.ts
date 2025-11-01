import { Passpin } from "@schema";
import { InferSelectModel } from "drizzle-orm";
import { IPasspin, IPasspinSpace } from "@scspace-depot/types/passpin";


type PasspinDBResult = InferSelectModel<typeof Passpin>;


export class MPasspin implements IPasspin {
    id: IPasspin['id'];
    spaceId: IPasspin['spaceId'];
    pin: IPasspin['pin'];
    timeCreated: IPasspin['timeCreated'];
    status: IPasspin['status'];

    constructor(passpin: IPasspin) {
        this.id = passpin.id;
        this.spaceId = passpin.spaceId;
        this.pin = passpin.pin;
        this.timeCreated = passpin.timeCreated;
        this.status = passpin.status;
    }


    static fromDB(passpin: PasspinDBResult): IPasspin {
        return {
            id: passpin.id,
            spaceId: passpin.spaceId,
            pin: passpin.pin,
            timeCreated: passpin.timeCreated,
            status: passpin.status,
        };
    }
}


export class MPasspinSpace implements IPasspinSpace {
    spaceId: IPasspinSpace['spaceId'];
    currentPin: IPasspinSpace['currentPin'];
    previousPin: IPasspinSpace['previousPin'];
    changedAt: IPasspinSpace['changedAt'];

    constructor(passpinSpace: IPasspinSpace) {
        this.spaceId = passpinSpace.spaceId;
        this.currentPin = passpinSpace.currentPin;
        this.previousPin = passpinSpace.previousPin;
        this.changedAt = passpinSpace.changedAt;
    }

    static fromDB(current: PasspinDBResult, previous?: PasspinDBResult): IPasspinSpace {
        return {
            spaceId: current.spaceId,
            currentPin: MPasspin.fromDB(current),
            previousPin: previous ? MPasspin.fromDB(previous) : null,
            changedAt: current.timeCreated,
        }
    }
}