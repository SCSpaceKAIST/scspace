export interface IReservationContent {
  id: number;
  description: string;
  innerParticipantNumber: number;
  outerParticipantNumber: number;
  food: string;
  desk: number;
  chair: number;
  lobby: boolean;
  workerNeed: number;
}
