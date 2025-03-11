import {
  Injectable,
  Inject,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {
  schema,
  Reservation,
  ReservationContent,
  ReservationContentArrayElement,
} from '@schema';
import {
  eq,
  and,
  lte,
  gte,
  or,
  SQL,
  not,
  inArray,
  InferInsertModel,
} from 'drizzle-orm';
import {
  IReservationCreate,
  isTeamContent,
  isHallContent,
  IReservation,
} from '@scspace-depot/types/reservation';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
import {
  ReservationStateEnum,
  ReservationWorkerNeedEnum,
  ReservationContentArrayElementTypeEnum,
} from '@scspace-depot/enums/reservation.enum';
import { MReservation } from '@scspace-server/feature/reservation/reservation.model';

@Injectable()
export class ReservationRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async find(param: {
    id?: number;
    userId?: number;
    spaceId?: number;
    spaceIds?: number[];
    teamId?: number;
    state?: ReservationStateEnum;
    states?: ReservationStateEnum[];
    workerNeed?: ReservationWorkerNeedEnum;
    timeRange?: {
      timeFrom?: Date;
      timeTo?: Date;
    };
  }): Promise<MReservation[]> {
    const whereClause: SQL[] = [];
    if (param.id) {
      whereClause.push(eq(Reservation.id, param.id));
    }
    if (param.userId) {
      whereClause.push(eq(Reservation.userId, param.userId));
    }
    if (param.spaceId) {
      whereClause.push(eq(Reservation.spaceId, param.spaceId));
    }
    if (param.spaceIds) {
      whereClause.push(inArray(Reservation.spaceId, param.spaceIds));
    }
    if (param.teamId) {
      whereClause.push(eq(Reservation.teamId, param.teamId));
    }
    if (param.state) {
      whereClause.push(eq(Reservation.state, param.state));
    }
    if (param.states) {
      if (param.states.length === 0) return [];
      whereClause.push(inArray(Reservation.state, param.states));
    }
    if (param.workerNeed) {
      whereClause.push(eq(Reservation.workerNeed, param.workerNeed));
    }
    if (param.timeRange) {
      const timeFrom = param.timeRange.timeFrom;
      const timeTo = param.timeRange.timeTo;

      if (!timeFrom || !timeTo) {
        const timeWhereClause: SQL[] = [];

        if (timeFrom) {
          timeWhereClause.push(gte(Reservation.timeTo, timeFrom));
        }
        if (timeTo) {
          timeWhereClause.push(lte(Reservation.timeFrom, timeTo));
        }
        const clause = not(or(...timeWhereClause) as SQL); // TODO: 자꾸 undefined 일 수 있다고 에러 떠서 as 써놨는데, 나중에 수정 필요

        whereClause.push(clause);
      }
    }

    const reservations = await this.db
      .select({
        reservation: Reservation,
        reservationContent: ReservationContent,
      })
      .from(Reservation)
      .innerJoin(
        ReservationContent,
        eq(Reservation.id, ReservationContent.reservationId),
      )
      .where(and(...whereClause));

    if (reservations.length === 0) {
      return [];
    } // 예약이 없을 때 inArray 조건에 넣으면 에러 발생

    const reservationContentArrayElements = await this.db
      .select()
      .from(ReservationContentArrayElement)
      .where(
        inArray(
          ReservationContentArrayElement.reservationId,
          reservations.map((e) => e.reservation.id),
        ),
      );

    const reservationDBResult = reservations.map((reservation) => ({
      reservation: reservation.reservation,
      reservationContent: reservation.reservationContent,
      reservationContentArrayElement: reservationContentArrayElements.filter(
        (e) => e.reservationId === reservation.reservation.id,
      ),
    }));

    return reservationDBResult.map((result) => MReservation.fromDB(result));
  }

  async insert(
    reservationInput: IReservationCreate,
    spaceType: SpaceTypeEnum,
  ): Promise<boolean> {
    const reservation = {
      userId: reservationInput.userId,
      teamId: reservationInput.teamId ?? undefined,
      spaceId: reservationInput.spaceId,
      timeFrom: new Date(reservationInput.timeFrom),
      timeTo: new Date(reservationInput.timeTo),
      state: ReservationStateEnum.WAIT,
      workerNeed: ReservationWorkerNeedEnum.UNNECESSARY,
    };
    const content = reservationInput.content;
    return this.db.transaction(async (tx) => {
      // 데이터 삽입
      Logger.log('reservation repository insert reservation', reservation);
      const [insertedReservation] = await tx
        .insert(Reservation)
        .values(reservation);
      const reservationId = insertedReservation.insertId;

      if (!reservationId) {
        throw new BadRequestException('Reservation insertion failed');
      }

      const reservationContent: InferInsertModel<typeof ReservationContent> = {
        reservationId,
        spaceType,
        ...reservationInput.content,
      };

      const reservationContentArrayElements: InferInsertModel<
        typeof ReservationContentArrayElement
      >[] = [];

      if (isTeamContent(reservationInput.content)) {
        reservationContentArrayElements.push(
          ...reservationInput.content.teamMemberUserIds.map((userId) => ({
            reservationId,
            element: userId,
            elementType:
              ReservationContentArrayElementTypeEnum.TEAM_MEMBER_USER_ID,
          })),
        );
      } else if (isHallContent(reservationInput.content)) {
        reservationContentArrayElements.push(
          ...reservationInput.content.equipment.map((equipment) => ({
            reservationId,
            element: equipment,
            elementType: ReservationContentArrayElementTypeEnum.EQUIPMENT,
          })),
          ...reservationInput.content.character.map((character) => ({
            reservationId,
            element: character,
            elementType: ReservationContentArrayElementTypeEnum.CHARACTER,
          })),
        );
      }

      Logger.log('reservationContent', reservationContent);
      Logger.log('reservationInput.content', reservationContentArrayElements);
      // 예약 내용 삽입
      const insertedReservationContentId = await tx
        .insert(ReservationContent)
        .values(reservationContent)
        .$returningId();

      if (!insertedReservationContentId) {
        throw new BadRequestException('Reservation content insertion failed');
      }

      if (reservationContentArrayElements.length > 0) {
        const insertedReservationContentArrayElementsIds = await tx
          .insert(ReservationContentArrayElement)
          .values(reservationContentArrayElements)
          .$returningId();

        if (
          insertedReservationContentArrayElementsIds.length !==
          reservationContentArrayElements.length
        ) {
          throw new BadRequestException(
            'Reservation content array element insertion failed',
          );
        }
      }

      return true;
    });
  }

  async updateReservation(data: IReservation): Promise<boolean> {
    const [result] = await this.db
      .update(Reservation)
      .set(data)
      .where(eq(Reservation.id, data.id));
    return result.affectedRows > 0;
  }
}
