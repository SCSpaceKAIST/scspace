import { ReservationContentArrayElementTypeEnum } from '@scspace-depot/enums/reservation.enum';
import { IReservation } from '@scspace-depot/types/reservation/index';
import {
  Reservation,
  ReservationContent,
  ReservationContentArrayElement,
} from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type ReservationDBResult = {
  reservation: InferSelectModel<typeof Reservation>;
  reservationContent: InferSelectModel<typeof ReservationContent>;
  reservationContentArrayElement: InferSelectModel<
    typeof ReservationContentArrayElement
  >[];
};

export class MReservation implements IReservation {
  id: IReservation['id'];
  spaceId: IReservation['spaceId'];
  timeFrom: IReservation['timeFrom'];
  timeTo: IReservation['timeTo'];
  timePost: IReservation['timePost'];
  content: IReservation['content'];
  comment: IReservation['comment'];
  state: IReservation['state'];
  workerNeed: IReservation['workerNeed'];
  userId: IReservation['userId'];
  teamId: IReservation['teamId'];

  constructor(private readonly data: IReservation) {
    Object.assign(this, data);
  }

  static fromDB(result: ReservationDBResult): MReservation {
    return new MReservation({
      ...result.reservation,
      content: {
        ...result.reservationContent,
        teamMemberUserIds: result.reservationContentArrayElement
          .filter(
            (e) =>
              e.elementType ===
              ReservationContentArrayElementTypeEnum.TEAM_MEMBER_USER_ID,
          )
          .map((e) => e.element),
        equipment: result.reservationContentArrayElement
          .filter(
            (e) =>
              e.elementType ===
              ReservationContentArrayElementTypeEnum.EQUIPMENT,
          )
          .map((e) => e.element),
        character: result.reservationContentArrayElement
          .filter(
            (e) =>
              e.elementType ===
              ReservationContentArrayElementTypeEnum.CHARACTER,
          )
          .map((e) => e.element),
      },
    });
  }
}
