// Table: team_members
export interface TeamMemberType {
  id: number;
  team_id: number;
  user_id: string; // char(8)
  joined: boolean;
}
