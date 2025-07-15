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

export type IMailUser = Pick<
    IUser,
    "nameKr" | "nameEn" | "email" | "studentNumber"
>;

export type IMailOrganization = Pick<
    IOrganization,
    "name" | "status" | "hasRoom"
>;

export type IMailReservation = Pick<
    IReservation,
    "title" | "content" | "timeFrom" | "timeTo"
>;

export type IMailSpace = Pick<
    ISpace,
    "nameEn" | "nameKr"
>;