import { IReservation, IReservationContent, IReservationSimple, IReservationSimpleAll } from '@scspace-depot/types/reservation';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { Reservation, ReservationContent, schema, Space } from '@schema';
import { InferSelectModel } from 'drizzle-orm';
import { ISpace } from '@scspace-depot/types/space';
import { IUser } from '@scspace-depot/types/user';
import { IOrganization } from '@scspace-depot/types/organization';

type ReservationDBResult = {
  reservation: InferSelectModel<typeof schema.Reservation>;
  reservationContent: InferSelectModel<typeof schema.ReservationContent>;
};

export class MReservationContent implements IReservationContent {
  id: IReservationContent['id'];
  description: IReservationContent['description'];
  innerParticipantNumber: IReservationContent['innerParticipantNumber'];
  outerParticipantNumber: IReservationContent['outerParticipantNumber'];
  food: IReservationContent['food'];
  desk: IReservationContent['desk'];
  chair: IReservationContent['chair'];
  lobby: IReservationContent['lobby'];
  busking: IReservationContent['busking'];
  workerNeed: IReservationContent['workerNeed'];

  constructor(data: IReservationContent) {
    this.id = data.id;
    this.description = data.description ?? '';
    this.innerParticipantNumber = data.innerParticipantNumber ?? 0;
    this.outerParticipantNumber = data.outerParticipantNumber ?? 0;
    this.food = data.food ?? '';
    this.desk = data.desk ?? 0;
    this.chair = data.chair ?? 0;
    this.lobby = data.lobby ?? false;
    this.busking = data.busking ?? false;
    this.workerNeed = data.workerNeed ?? 1;
  }

  static fromDB(reservationContent: typeof ReservationContent.$inferSelect): MReservationContent {
    return new MReservationContent({
      id: reservationContent.id,
      description: reservationContent.description,
      innerParticipantNumber: reservationContent.innerParticipantNumber,
      outerParticipantNumber: reservationContent.outerParticipantNumber,
      food: reservationContent.food,
      desk: reservationContent.desk,
      chair: reservationContent.chair,
      lobby: reservationContent.lobby,
      busking: reservationContent.busking,
      workerNeed: reservationContent.workerNeed,
    });
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
  timeUpdate: IReservation['timeUpdate'];
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
    this.timeUpdate = data.timeUpdate;
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
      busking: false,
      workerNeed: 1,
    });
  }

  static fromDB(reservation: typeof Reservation.$inferSelect, reservationContent: typeof ReservationContent.$inferSelect): MReservation {
    return new MReservation({
      id: reservation.id,
      userId: reservation.userId,
      organizationId: reservation.organizationId,
      spaceId: reservation.spaceId,
      title: reservation.title,
      timeFrom: reservation.timeFrom,
      timeTo: reservation.timeTo,
      timePost: reservation.timePost,
      timeUpdate: reservation.timeUpdate,
      state: reservation.state,
      content: reservationContent ? MReservationContent.fromDB(reservationContent) : new MReservationContent({
        id: reservation.id,
        description: '',
        innerParticipantNumber: 0,
        outerParticipantNumber: 0,
        food: '',
        desk: 0,
        chair: 0,
        lobby: false,
        busking: false,
        workerNeed: 1,
      }),
    });
  }
}

export class MReservationSimple implements IReservationSimple {
  id: IReservationSimple['id'];
  userId: IReservationSimple['userId'];
  organizationId: IReservationSimple['organizationId'];
  spaceId: IReservationSimple['spaceId'];
  title: IReservationSimple['title'];
  timeFrom: IReservationSimple['timeFrom'];
  timeTo: IReservationSimple['timeTo'];
  timePost: IReservationSimple['timePost'];
  timeUpdate: IReservationSimple['timeUpdate'];
  state: IReservationSimple['state'];

  constructor(data: IReservationSimple) {
    this.id = data.id;
    this.userId = data.userId;
    this.organizationId = data.organizationId;
    this.spaceId = data.spaceId;
    this.title = data.title;
    this.timeFrom = data.timeFrom;
    this.timeTo = data.timeTo;
    this.timePost = data.timePost;
    this.timeUpdate = data.timeUpdate;
    this.state = data.state;
  }

  static fromDB(reservation: typeof Reservation.$inferSelect): MReservationSimple {
    return new MReservationSimple({
      id: reservation.id,
      userId: reservation.userId,
      organizationId: reservation.organizationId,
      spaceId: reservation.spaceId,
      title: reservation.title,
      timeFrom: reservation.timeFrom,
      timeTo: reservation.timeTo,
      timePost: reservation.timePost,
      timeUpdate: reservation.timeUpdate,
      state: reservation.state,
    });
  }
}