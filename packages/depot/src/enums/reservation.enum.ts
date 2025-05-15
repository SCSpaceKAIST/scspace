export enum ReservationStateEnum {
  GRANT = 1,
  WAIT = 2,
  RECEIVED = 3,
  REJECTED = 4,
}

export enum ReservationWorkerNeedEnum {
  UNNECESSARY = 1,
  REQUIRED = 2,
  COMPLETED = 3,
  FAILED = 4,
}
