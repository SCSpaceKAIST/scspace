import { IUser } from "../user";
import { IOrganization } from "./organization.type";

// Table: organization_member
export interface IOrganizationMember {
  id: number;
  organizationId: number;
  userId: number;
  timeRegister: string;
}

export type IOrganizationMemberResponse = IOrganizationMember & {
  user: IUser;
}