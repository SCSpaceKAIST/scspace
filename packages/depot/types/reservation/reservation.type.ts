import { IUser } from "../user";
import { IReservationContent } from "./reservation.content.type";
import { ReservationCharacterEnum, ReservationHallEquipEnum, ReservationStateEnum, ReservationWorkerNeedEnum } from "../../enums/reservation.enum";
import { ISpace } from "../space";
import { ITeam } from "./team.type";

// Table: reservations
export interface IReservation {
  id: number;
  userId: number; // char(8)
  teamId?: number | null;
  spaceId: number;
  timeFrom: Date;
  timeTo: Date;
  timePost: Date;
  content: IReservationContent ; // 
  comment: string | null; // varchar(300)
  state: ReservationStateEnum;
  workerNeed: ReservationWorkerNeedEnum;
}

export type IReservationResponse = IReservation & {
  space: ISpace;
  user: IUser;
  team?: ITeam;
};

export type IReservationCreate = Omit<
  IReservation,
  "id" | "timePost" | "comment" 
> ;

export type IReservationUpdate = Omit<
  IReservation,
  "userId" | "timePost" | "spaceId" | "timeFrom" | "timeTo" | "content"
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
  [ReservationHallEquipEnum.LIGHT]: "조명",
  [ReservationHallEquipEnum.SOUND]: "음향",
  [ReservationHallEquipEnum.PROJECTOR]: "프로젝터",
};

export const reservationCharacterOptions = {
  [ReservationCharacterEnum.RELIGION]: "종교적",
  [ReservationCharacterEnum.RENTABILITY]: "영리성",
  [ReservationCharacterEnum.POLITIC]: "정치적",
};

export function isValidWorkerNeed(input: ReservationWorkerNeedEnum): boolean {
  return input === ReservationWorkerNeedEnum.UNNECESSARY || input === ReservationWorkerNeedEnum.COMPLETED;
}
