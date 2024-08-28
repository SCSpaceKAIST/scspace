// Table: teams
export interface TeamType {
  team_id: number;
  name: string; // char(70)
  delegator_id: string; // char(8)
  time_register: Date;
  semester_id: string; // char(3)
}
