import { IUser } from "../user";
import { IReservationContent } from "./reservation.content.type";
import { ReservationStateEnum, ReservationWorkerNeedEnum } from "../../enums/reservation.enum";
import { ISpace } from "../space";
import { ITeam } from "./team.type";

// Table: reservations
export interface IReservation {
  reservation_id: number;
  user_id: string; // char(8)
  team_id?: number | null;
  space_id: number;
  time_from: Date;
  time_to: Date;
  time_post: Date;
  content: IReservationContent | null; // json
  comment: string | null; // varchar(300)
  state: ReservationStateEnum;
  worker_need: ReservationWorkerNeedEnum;
}

export type IReservationResponse = IReservation & {
  space: ISpace;
  user: IUser;
  team?: ITeam;
};

export type IReservationCreate = Omit<
  IReservation,
  "reservation_id" | "time_post" | "comment" | "time_from" | "time_to"
> & {
  time_from: string; // time_from을 string 타입으로 변경
  time_to: string; // time_to를 string 타입으로 변경
};

export type ISpaceTimeCheckCreate = Pick<
  IReservationCreate,
  "space_id" | "time_from" | "time_to"
>;

export type IUserTimeCheckCreate = ISpaceTimeCheckCreate & {
  user_id: string;
};

export const reservationStateOptions: {
  [key in ReservationStateEnum]: string;
} = {
  [ReservationStateEnum.GRANT]: "승인",
  [ReservationStateEnum.WAIT]: "대기",
  [ReservationStateEnum.REJECTED]: "거절",
  [ReservationStateEnum.RECEIVED]: "접수",
};

export const workerNeedOptions: { [key in ReservationWorkerNeedEnum]: string } = {
  [ReservationWorkerNeedEnum.UNNECESSARY]: "근로 필요 없음",
  [ReservationWorkerNeedEnum.REQUIRED]: "근로 필요",
  [ReservationWorkerNeedEnum.COMPLETED]: "근로 배치 완료",
  [ReservationWorkerNeedEnum.FAILED]: "근로 배치 실패",
};

export const workerNeedUserOptions = {
  [ReservationWorkerNeedEnum.UNNECESSARY]: "근로 필요 없음",
  [ReservationWorkerNeedEnum.REQUIRED]: "근로 필요",
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

export function isValidWorkerNeed(input: ReservationWorkerNeedEnum): boolean {
  return input === ReservationWorkerNeedEnum.UNNECESSARY || input === ReservationWorkerNeedEnum.COMPLETED;
}
