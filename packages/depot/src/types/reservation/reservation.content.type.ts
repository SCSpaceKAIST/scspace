export interface IReservationContent {
  id: number;
  description: string;
  innerParticipantNumber: number;
  outerParticipantNumber: number;
  food: string;
  desk: number;
  chair: number;
  busking: boolean;
  workerNeed: number;
}

export type IReservationContentCreate = Omit<IReservationContent, "id">;