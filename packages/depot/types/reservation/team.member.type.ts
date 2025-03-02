import { IUser } from "../user";
import { ITeam } from "./team.type";

// Table: team_members
export interface ITeamMember {
  id: number;
  teamId: number;
  userId: number; // char(8)
  joined: boolean; // 지금 활용 안되는 중
}

export type ITeamMemberResponse = ITeamMember & {
  user: IUser;
};
