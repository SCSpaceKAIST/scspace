import { IUser } from "../user";
import { ITeamMemberResponse } from "./team.member.type";

// Table: teams
export interface ITeam {
  id: number;
  name: string; // char(70)
  delegator_id: number; // char(8)
  time_register: Date;
  semester_id: string; // char(3)
}

export type ITeamResponse = ITeam & {
  delegator: IUser;
  members: ITeamMemberResponse[];
};
