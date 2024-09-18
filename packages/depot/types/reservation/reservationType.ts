import { SpaceTypeEnum } from "../space";
import { UserType } from "../user";
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

export type ReservationOutputType = ReservationType & {
  name: string;
  space_type: SpaceTypeEnum;
  userInfo: UserType;
};

export type ReservationInputType = Omit<
  ReservationType,
  "reservation_id" | "time_post" | "comment" | "time_from" | "time_to"
> & {
  time_from: string; // time_from을 string 타입으로 변경
  time_to: string; // time_to를 string 타입으로 변경
};

export type SpaceTimeCheckInputType = Pick<
  ReservationInputType,
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
  unnecessary: "근로 필요 없음",
  required: "근로 필요",
  completed: "근로 배치 완료",
  failed: "근로 배치 실패",
};

export const workerNeedInputOptions = {
  unnecessary: "근로 필요 없음",
  required: "근로 필요",
};

export const hallEquipsOptions = {
  light: "조명",
  sound: "음향",
  projector: "프로젝터",
};

export const reservationCharacterOptions = {
  religion: "종교적",
  rentability: "영리성",
  politic: "정치적",
};

export function isValidWorkerNeed(input: string): input is WorkerNeedEnum {
  return ["unnecessary", "required", "completed", "failed"].includes(input);
}
