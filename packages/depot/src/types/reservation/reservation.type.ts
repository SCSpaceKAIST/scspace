import { IUser } from "../user";
import { IReservationContent, IReservationContentCreate } from "./reservation.content.type";
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
  timeFrom: number;
  timeTo: number;
  timePost: number;
  timeUpdate: number;
  state: ReservationStateEnum;
}

export type IReservationAll = IReservation & {
  space: ISpace;
  user: IUser;
  organization: IOrganization;
};

export type IReservationSimple = Omit<IReservation, "content">;

export type IReservationSimpleAll = IReservationSimple & {
  space: ISpace;
  user: IUser;
  organization: IOrganization;
};

export type IReservationCreate = Omit<
  IReservation,
  "id" | "timePost" | "timeUpdate" | "state" | "content"
> & {
  content: IReservationContentCreate;
};

export type IReservationCreateMultiple = Omit<IReservationCreate, "timeFrom" | "timeTo"> & {
  time: {
    timeFrom: number;
    timeTo: number;
  }[];
};

export type IReservationMultipleCreateResurt = Omit<
  IReservation, "id" | "timeFrom" | "timeTo" | "timeUpdate" | "content" | "state"
> & {
  result: {
    timeFrom: number;
    timeTo: number;
    success: boolean;
  }[];
}

export type IReservationUpdate = Omit<
  IReservation,
  "spaceId" | "organizationId" | "timePost" | "timeUpdate" | "state"
>;

// 공간 예약 시간 체크 요청
export type ISpaceTimeCheckRequest = Pick<
  IReservationCreate,
  "spaceId" | "timeFrom" | "timeTo"
>;

// 사용자 예약 시간 체크 요청
export type IUserTimeCheckRequest = ISpaceTimeCheckRequest & {
  userId: number;
};

// userId는 status를 바꾸는 사람의 id (isManager 확인 후 변경 가능하게 할꺼임)
export type IReservationStatusUpdate = Pick<
  IReservation,
  "userId" | "id" | "state"
>;

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
