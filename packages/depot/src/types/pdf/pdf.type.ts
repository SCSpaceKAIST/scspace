import { IGoods } from "../rental";
import { IUser } from "../user";
import { IOrganization } from "../organization";

export interface ICertificatePdf  {
    id : number,
    user : Partial<IUser>,
    organization ?: Partial<IOrganization>
    contact : string, //email or phone
    rentalFrom : string,     //ISO Date
    rentalTo : string,         //ISO Date
    goods : Partial<IGoods>,
    rentalDuration : number, //day
    rentalQuantity : number,
    usage ?: string,
    description ?: string,
}