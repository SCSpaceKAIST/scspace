import { ISemester } from "../semester";
import { IUser } from "../user";
import { ITeamMemberResponse } from "./team.member.type";

// Table: teams
export interface ITeam {
  id: number;
  name: string; // char(70)
  delegatorId: number; // char(8)
  timeRegister: Date;
  semesterId: number; // char(3)
}

export type ITeamResponse = ITeam & {
  delegator: IUser;
  semester: ISemester;
  members: ITeamMemberResponse[];
};
