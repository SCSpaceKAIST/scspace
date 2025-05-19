import { IReservation, IReservationContent } from '@scspace-depot/types/reservation';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { schema } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type ReservationDBResult = {
  reservation: InferSelectModel<typeof schema.Reservation>;
  reservationContent: InferSelectModel<typeof schema.ReservationContent>;
};

export class MReservationContent implements IReservationContent {
  id: number;
  description: string;
  innerParticipantNumber: number;
  outerParticipantNumber: number;
  food: string;
  desk: number;
  chair: number;
  lobby: boolean;
  workerNeed: number;

  constructor(data: IReservationContent) {
    this.id = data.id;
    this.description = data.description ?? '';
    this.innerParticipantNumber = data.innerParticipantNumber ?? 0;
    this.outerParticipantNumber = data.outerParticipantNumber ?? 0;
    this.food = data.food ?? '';
    this.desk = data.desk ?? 0;
    this.chair = data.chair ?? 0;
    this.lobby = data.lobby ?? false;
    this.workerNeed = data.workerNeed ?? 1;
  }

  static fromDB(result: InferSelectModel<typeof schema.ReservationContent>): MReservationContent {
    return new MReservationContent(result);
  }
}

export class MReservation implements IReservation {
  id: IReservation['id'];
  userId: IReservation['userId'];
  organizationId: IReservation['organizationId'];
  spaceId: IReservation['spaceId'];
  title: IReservation['title'];
  timeFrom: IReservation['timeFrom'];
  timeTo: IReservation['timeTo'];
  timePost: IReservation['timePost'];
  timeEdit: IReservation['timeEdit'];
  state: IReservation['state'];
  content: MReservationContent;

  constructor(data: IReservation) {
    this.id = data.id;
    this.userId = data.userId;
    this.organizationId = data.organizationId;
    this.spaceId = data.spaceId;
    this.title = data.title;
    this.timeFrom = data.timeFrom;
    this.timeTo = data.timeTo;
    this.timePost = data.timePost;
    this.timeEdit = data.timeEdit;
    this.state = data.state;
    this.content = data.content ? new MReservationContent(data.content) : new MReservationContent({
      id: data.id,
      description: '',
      innerParticipantNumber: 0,
      outerParticipantNumber: 0,
      food: '',
      desk: 0,
      chair: 0,
      lobby: false,
      workerNeed: 1,
    });
  }

  static fromDB(result: ReservationDBResult): MReservation {
    return new MReservation({
      id: result.reservation.id,
      userId: result.reservation.userId,
      organizationId: result.reservation.organizationId,
      spaceId: result.reservation.spaceId,
      title: result.reservation.title,
      timeFrom: result.reservation.timeFrom,
      timeTo: result.reservation.timeTo,
      timePost: result.reservation.timePost,
      timeEdit: result.reservation.timeEdit,
      state: result.reservation.state,
      content: result.reservationContent ? MReservationContent.fromDB(result.reservationContent) : new MReservationContent({
        id: result.reservation.id,
        description: '',
        innerParticipantNumber: 0,
        outerParticipantNumber: 0,
        food: '',
        desk: 0,
        chair: 0,
        lobby: false,
        workerNeed: 1,
      }),
    });
  }
}
