import { ReservationContentTypeEnum } from "./reservationContentType";

export type ReservationStateEnum = "grant" | "wait" | "rejected" | "received";
export type WorkerNeedEnum =
  | "unnecessary"
  | "required"
  | "completed"
  | "failed";

// Table: reservations
export interface ReservationType {
  reservation_id: number;
  user_id: string; // char(8)
  team_id?: number | null;
  space_id: number;
  time_from: Date;
  time_to: Date;
  time_post: Date;
  content: ReservationContentTypeEnum | null; // json
  comment: string | null; // varchar(300)
  state: ReservationStateEnum;
  worker_need: WorkerNeedEnum;
}

export type ReservationInputType = Omit<
  ReservationType,
  "reservation_id" | "time_post" | "comment"
>;

export type SpaceTimeCheckInputType = Pick<
  ReservationType,
  "space_id" | "time_from" | "time_to"
>;

export type UserTimeCheckInputType = SpaceTimeCheckInputType & {
  user_id: string;
};

export const reservationStateOptions: {
  [key in ReservationStateEnum]: string;
} = {
  grant: "승인",
  wait: "대기",
  rejected: "거절",
  received: "접수",
};

export const workerNeedOptions: { [key in WorkerNeedEnum]: string } = {
  unnecessary: "근로 필요",
  required: "근로 요청",
  completed: "근로 배치 완료",
  failed: "근로 배치 실패",
};
