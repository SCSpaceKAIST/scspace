import { IOrganizationAll } from "../organization";
import { IReservationAll } from "../reservation";
import { ISpace } from "../space";
import { IUser } from "../user";

export interface IMail {
    subject: string;
    template: "orgVerify" | "orgVerified" | "welcome";
    to: string;
    context: {
        user?: Partial<IUser>;
        organization?: Partial<IOrganizationAll>;
        space?: Partial<ISpace>;
        reservation?: Partial<IReservationAll>;
    }
}