import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {
  schema,
  Reservation,
  ReservationContent,
} from '@schema';
import {
  eq,
  and,
  lte,
  gte,
  or,
  SQL,
  inArray,
  InferInsertModel,
  between,
} from 'drizzle-orm';
import {
  IReservationCreate,
  IReservation,
} from '@scspace-depot/types/reservation';
import {
  ReservationStateEnum,
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
    organizationId?: number;
    state?: ReservationStateEnum;
    states?: ReservationStateEnum[];
    timeRange?: {
      timeFrom?: string;
      timeTo?: string;
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
    if (param.organizationId) {
      whereClause.push(eq(Reservation.organizationId, param.organizationId));
    }
    if (param.state) {
      whereClause.push(eq(Reservation.state, param.state));
    }
    if (param.states) {
      if (param.states.length === 0) return [];
      whereClause.push(inArray(Reservation.state, param.states));
    }
    if (param.timeRange) {
      const timeFrom = param.timeRange.timeFrom;
      const timeTo = param.timeRange.timeTo;

      if (timeFrom && timeTo) {
        const timeWhereClause: SQL[] = [];
        timeWhereClause.push(between(Reservation.timeFrom, timeFrom, timeTo));
        timeWhereClause.push(between(Reservation.timeTo, timeFrom, timeTo));
        timeWhereClause.push(
          and(
            lte(Reservation.timeFrom, timeFrom),
            gte(Reservation.timeTo, timeTo),
          ),
        );
        whereClause.push(or(...timeWhereClause));
      }
    }

    const reservations = await this.db
      .select({
        reservation: Reservation,
        reservationContent: ReservationContent,
      })
      .from(Reservation)
      .leftJoin(
        ReservationContent,
        eq(Reservation.id, ReservationContent.id),
      )
      .where(and(...whereClause));

    if (reservations.length === 0) {
      return [];
    }

    // Filter out reservations without content
    const validReservations = reservations.filter(
      (result) => result.reservationContent !== null
    );

    return validReservations.map((result) => MReservation.fromDB(result));
  }

  async insert(
    reservationInput: IReservationCreate,
  ): Promise<MReservation> {
    return await this.db.transaction(async (tx) => {
      // Insert reservation
      const [insertedReservation] = await tx
        .insert(Reservation)
        .values({
          userId: reservationInput.userId,
          organizationId: reservationInput.organizationId,
          spaceId: reservationInput.spaceId,
          title: reservationInput.title,
          timeFrom: reservationInput.timeFrom,
          timeTo: reservationInput.timeTo,
          state: ReservationStateEnum.WAIT,
        } as InferInsertModel<typeof Reservation>);

      const reservationId = insertedReservation.insertId;
      if (!reservationId) {
        throw new BadRequestException('Failed to insert reservation');
      }

      // Insert reservation content
      await tx.insert(ReservationContent)
        .values({
          id: reservationId,
          description: reservationInput.content?.description ?? '',
          innerParticipantNumber: reservationInput.content?.innerParticipantNumber ?? 0,
          outerParticipantNumber: reservationInput.content?.outerParticipantNumber ?? 0,
          food: reservationInput.content?.food ?? '',
          desk: reservationInput.content?.desk ?? 0,
          chair: reservationInput.content?.chair ?? 0,
          lobby: reservationInput.content?.lobby ?? false,
          workerNeed: reservationInput.content?.workerNeed ?? 1,
        } as InferInsertModel<typeof ReservationContent>);

      // Fetch the complete reservation with content
      const result = await tx
        .select({
          reservation: Reservation,
          reservationContent: ReservationContent,
        })
        .from(Reservation)
        .leftJoin(
          ReservationContent,
          eq(Reservation.id, ReservationContent.id),
        )
        .where(eq(Reservation.id, reservationId))
        .then((results) => results[0]);

      if (!result || !result.reservationContent) {
        throw new BadRequestException('Failed to fetch created reservation');
      }

      return MReservation.fromDB(result);
    });
  }

  async update(data: Partial<IReservation>): Promise<boolean> {
    const updateData = {
      userId: data.userId,
      organizationId: data.organizationId,
      spaceId: data.spaceId,
      title: data.title,
      timeFrom: data.timeFrom,
      timeTo: data.timeTo,
      state: data.state,
    } as Partial<InferInsertModel<typeof Reservation>>;

    const [result] = await this.db
      .update(Reservation)
      .set(updateData)
      .where(eq(Reservation.id, data.id!));
    return result.affectedRows > 0;
  }
}