import { UserType } from "../user";

// Table: team_members
export interface TeamMemberType {
  id: number;
  team_id: number;
  user_id: string; // char(8)
  joined: boolean; // 지금 활용 안되는 중
}

export type TeamMemberOuptutType = TeamMemberType & {
  userInfo: UserType;
};
