export interface IReservationContent {
  id: number;
  description: string;
  innerParticipantNumber: number;
  outerParticipantNumber: number;
  food: string;
  busking: boolean;
  worker: number;
}

export type IReservationContentCreate = Omit<IReservationContent, "id">;