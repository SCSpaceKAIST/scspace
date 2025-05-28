import { IUser } from "../user";
import { IOrganizationMemberResponse } from "./organization.member.type";

// Table: organization
export interface IOrganization {
  id: number;
  name: string;
  delegatorId: number;
  timeRegister: number;
  timeUpdate: number;
};

export type IOrganizationAll = IOrganization & {
  delegator: IUser;
  members: IOrganizationMemberResponse[];
};

export type IOrganizationDelegator = IOrganization & {
  delegator: IUser;
};

export type IOrganizationCreate = Omit<
  IOrganization,
  "id" | "timeRegister" | "timeUpdate"
>;

export type IOrganizationUpdate = Omit<
  IOrganization,
  "id" | "timeRegister" | "timeUpdate"
>;

export interface IOrganizationUser {
  userId: number;
};