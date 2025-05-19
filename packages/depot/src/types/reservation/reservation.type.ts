import { IUser } from "../user";
import { IReservationContent } from "./reservation.content.type";
import { ReservationStateEnum, ReservationWorkerNeedEnum } from "../../enums/reservation.enum";
import { ISpace } from "../space";
import { IOrganization } from "../organization";

// Table: reservations
export interface IReservation {
  id: number;
  userId: number;
  organizationId: number;
  spaceId: number;
  title: string;
  content: IReservationContent;
  timeFrom: string;
  timeTo: string;
  timePost: string;
  timeUpdate: string;
  state: ReservationStateEnum;
}

export type IReservationResponse = IReservation & {
  space: ISpace;
  user: IUser;
  organization: IOrganization;
};

export type IReservationCreate = Omit<
  IReservation,
  "id" | "timePost" | "timeEdit" | "timeUpdate" | "state"
>;

export type IReservationUpdate = Omit<
  IReservation,
  "userId" | "timePost" | "spaceId" | "organizationId" | "timeUpdate" | "state"
>;

// 공간 예약 시간 체크 요청
export type ISpaceTimeCheckRequest = Pick<
  IReservationCreate,
  "spaceId" | "organizationId" | "timeFrom" | "timeTo"
>;

// 사용자 예약 시간 체크 요청
export type IUserTimeCheckRequest = ISpaceTimeCheckRequest & {
  userId: number;
};

export const reservationStateOptions: {
  [key in ReservationStateEnum]: string;
} = {
  [ReservationStateEnum.GRANT]: "승인",
  [ReservationStateEnum.WAIT]: "대기",
  [ReservationStateEnum.REJECTED]: "거절",
  [ReservationStateEnum.RECEIVED]: "접수",
};

export const reservationStateOptionsEn: {
  [key in ReservationStateEnum]: string;
} = {
  [ReservationStateEnum.GRANT]: "grant",
  [ReservationStateEnum.WAIT]: "wait",
  [ReservationStateEnum.REJECTED]: "reject",
  [ReservationStateEnum.RECEIVED]: "received",
};

export const workerNeedOptions: { [key in ReservationWorkerNeedEnum]: string } = {
  [ReservationWorkerNeedEnum.UNNECESSARY]: "근로 필요 없음",
  [ReservationWorkerNeedEnum.REQUIRED]: "근로 필요",
  [ReservationWorkerNeedEnum.COMPLETED]: "근로 배치 완료",
  [ReservationWorkerNeedEnum.FAILED]: "근로 배치 실패",
};

export const workerNeedOptionsEn: { [key in ReservationWorkerNeedEnum]: string } = {
  [ReservationWorkerNeedEnum.UNNECESSARY]: "unnecessary",
  [ReservationWorkerNeedEnum.REQUIRED]: "required",
  [ReservationWorkerNeedEnum.COMPLETED]: "completed",
  [ReservationWorkerNeedEnum.FAILED]: "failed",
};

export const workerNeedUserOptions = {
  [ReservationWorkerNeedEnum.UNNECESSARY]: "근로 필요 없음",
  [ReservationWorkerNeedEnum.REQUIRED]: "근로 필요",
};

export function isValidWorkerNeed(input: ReservationWorkerNeedEnum): boolean {
  return input === ReservationWorkerNeedEnum.UNNECESSARY || input === ReservationWorkerNeedEnum.COMPLETED;
}
