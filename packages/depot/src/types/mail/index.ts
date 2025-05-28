import { IOrganization } from "../organization";
import { IReservation } from "../reservation";
import { ISpace } from "../space";
import { IUser } from "../user";

export interface IMail {
    subject: string;
    template: string;
    context: {
        user: IMailUser;
        organization?: IMailOrganization;
        space?: IMailSpace;
        reservation?: IMailReservation;
    }
}

export type IMailUser = Omit<
    IUser,
    "type" | "id"
>;

export type IMailOrganization = Omit<
    IOrganization,
    "id" | "timeRegister" | "timeUpdate" | "delegatorId"
>;

export type IMailReservation = Omit<
    IReservation,
    "id" | "userId" | "organizationId" | "spaceId" | "timePost" | "timeUpdate" | "state"
>;

export type IMailSpace = Omit<
    ISpace,
    "id" | "spaceType"
>;