import { IUser } from "../user";
import { IOrganizationMemberResponse } from "./organization.member.type";

// Table: organization
export interface IOrganization {
  id: number;
  name: string;
  delegatorId: number;
  timeRegister: string;
  timeUpdate: string;
}

export type IOrganizationResponse = IOrganization & {
  delegator: IUser;
  members: IOrganizationMemberResponse[];
};
