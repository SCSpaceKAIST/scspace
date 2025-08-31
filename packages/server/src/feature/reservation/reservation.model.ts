import { IReservation, IReservationContent, IReservationSimple } from '@scspace-depot/types/reservation';
import { Reservation, ReservationContent, schema } from '@schema';

export class MReservationContent implements IReservationContent {
  id: IReservationContent['id'];
  description: IReservationContent['description'];
  innerParticipantNumber: IReservationContent['innerParticipantNumber'];
  outerParticipantNumber: IReservationContent['outerParticipantNumber'];
  food: IReservationContent['food'];
  busking: IReservationContent['busking'];
  workerNeed: IReservationContent['workerNeed'];
  workerId: IReservationContent['workerId'];

  constructor(data: IReservationContent) {
    this.id = data.id;
    this.description = data.description ?? '';
    this.innerParticipantNumber = data.innerParticipantNumber ?? 0;
    this.outerParticipantNumber = data.outerParticipantNumber ?? 0;
    this.food = data.food ?? '';
    this.busking = data.busking ?? false;
    this.workerNeed = data.workerNeed ?? false;
    this.workerId = data.workerId ?? 0;
  }

  static fromDB(reservationContent: typeof ReservationContent.$inferSelect): IReservationContent {
    return {
      id: reservationContent.id,
      description: reservationContent.description,
      innerParticipantNumber: reservationContent.innerParticipantNumber,
      outerParticipantNumber: reservationContent.outerParticipantNumber,
      food: reservationContent.food,
      busking: reservationContent.busking,
      workerNeed: reservationContent.workerNeed,
      workerId: reservationContent.workerId,
    };
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
      busking: false,
      workerNeed: false,
      workerId: 0,
    });
  }

  static fromDB(reservation: typeof Reservation.$inferSelect, reservationContent: typeof ReservationContent.$inferSelect): IReservation {
    return {
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
        busking: false,
        workerNeed: false,
        workerId: 0,
      }),
    };
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

  static fromDB(reservation: typeof Reservation.$inferSelect): IReservationSimple {
    return {
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
    };
  }
}