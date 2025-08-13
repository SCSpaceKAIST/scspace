import { OrganizationStatusEnum } from "../../enums/organization.enum";
import { IOrganizationAll } from "../organization";

export interface IMail {
    subject: string;
    template: "orgStatusUpdate" | "welcome" | "orgDelegatorUpdate" | "reservationPosted" | "errorLog" | "postMultipleReservation";
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    context: {
        // user?: Partial<IUser>;
        // organization?: Partial<IMailOrganization>;
        // space?: Partial<ISpace>;
        // reservation?: Partial<IReservationAll>;
        // reservations?: Partial<IReservationMultipleCreateResurt>[];
        // error?: Error;
        // comment?: string;
        // meta?: object;
    }
}

export interface IMailOrganization extends Omit<
    IOrganizationAll,
    "status"
> {
    status: {
        kr: string;
        en: string;
    } | OrganizationStatusEnum;
}