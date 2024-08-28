type ReservationStateEnum = "grant" | "wait" | "rejected";
type WorkerNeedEnum = "unnecessary" | "required" | "completed" | "failed";

// Table: reservations
export interface ReservationType {
  reservation_id: number;
  user_id: string; // char(8)
  team_id?: number | null;
  space_id: number;
  time_from: Date;
  time_to: Date;
  time_post: Date;
  time_edit: Date;
  content: any; // json
  comment: string; // varchar(300)
  state: ReservationStateEnum;
  worker_need: WorkerNeedEnum;
}
