import { IUser } from "../user";

// Table: organization_member
export interface IOrganizationMember {
  id: number;
  organizationId: number;
  userId: number;
  timeRegister: number;
}

export type IOrganizationMemberResponse = IOrganizationMember & {
  user: IUser;
}