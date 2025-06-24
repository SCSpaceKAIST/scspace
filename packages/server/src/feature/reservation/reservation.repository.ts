import {
  Injectable,
  Inject,
  NotFoundException,
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
  SQL,
  inArray,
  InferInsertModel,
  gt,
  lt,
  desc,
  or,
  gte,
  lte,
  count
} from 'drizzle-orm';
import {
  IReservationCreate,
  // IReservation,
  // IReservationSimple,
  IReservationUpdate,
} from '@scspace-depot/types/reservation';
import {
  ReservationStateEnum,
} from '@scspace-depot/enums/reservation.enum';
import { MReservation, MReservationContent, MReservationSimple } from '@scspace-server/feature/reservation/reservation.model';
import { getNow } from '@scspace-server/common/util';

@Injectable()
export class ReservationRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>
  ) { }

  sqlGenerator(param: {
    id?: number;
    userId?: number;
    spaceId?: number;
    spaceIds?: number[];
    organizationId?: number;
    state?: ReservationStateEnum;
    states?: ReservationStateEnum[];
    limit?: number;
    offset?: number;
    timeRange?: {
      timeFrom?: number;
      timeTo?: number;
    };
  }): SQL[] {
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
    if ((param.organizationId ?? -1) > -1) {
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
        whereClause.push(
          or(
            and(
              gt(Reservation.timeFrom, timeFrom),
              lt(Reservation.timeFrom, timeTo)
            ),
            and(
              gt(Reservation.timeTo, timeFrom),
              lt(Reservation.timeTo, timeTo)
            ),
            and(
              lte(Reservation.timeFrom, timeFrom),
              gte(Reservation.timeTo, timeTo)
            )
          )
        );
      }
    }

    return whereClause;
  }

  async fetch(param: {
    id?: number;
    userId?: number;
    spaceId?: number;
    spaceIds?: number[];
    organizationId?: number;
    state?: ReservationStateEnum;
    states?: ReservationStateEnum[];
    limit?: number;
    offset?: number;
    timeRange?: {
      timeFrom?: number;
      timeTo?: number;
    };
  }): Promise<MReservationSimple[]> {
    const whereClause: SQL[] = this.sqlGenerator(param);

    const reservations = this.db
      .select()
      .from(Reservation)
      .where(and(...whereClause))
      .orderBy(desc(Reservation.id));

    if (param.limit && param.offset)
      return await reservations.limit(param.limit).offset(param.offset);
    else if (param.limit)
      return await reservations.limit(param.limit);
    else if (param.offset)
      return await reservations.offset(param.offset);
    else
      return await reservations;
  }

  async fetchCount(param: {
    id?: number;
    userId?: number;
    spaceId?: number;
    spaceIds?: number[];
    organizationId?: number;
    state?: ReservationStateEnum;
    states?: ReservationStateEnum[];
    timeRange?: {
      timeFrom?: number;
      timeTo?: number;
    };
  }): Promise<number> {
    const whereClause: SQL[] = this.sqlGenerator(param);

    const reservationCount = await this.db
      .select({
        count: count()
      })
      .from(Reservation)
      .where(and(...whereClause))

    return reservationCount[0].count;
  }

  async fetchContent(id: number): Promise<MReservationContent> {
    const reservationContent = await this.db
      .select()
      .from(ReservationContent)
      .where(eq(ReservationContent.id, id));
    return reservationContent[0];
  }

  async insert(
    reservationInput: IReservationCreate,
  ): Promise<[MReservationSimple, MReservationContent]> {
    const insertData = {
      userId: reservationInput.userId,
      organizationId: reservationInput.organizationId,
      spaceId: reservationInput.spaceId,
      title: reservationInput.title,
      timeFrom: reservationInput.timeFrom,
      timeTo: reservationInput.timeTo,
      timePost: getNow(),
      timeUpdate: getNow(),
      state: ReservationStateEnum.GRANT,
    } as InferInsertModel<typeof Reservation>;

    const [result] = await this.db.insert(Reservation).values(insertData);
    if (!result.insertId) {
      throw new Error('Failed to get inserted ID');
    }

    const reservationCreated = await this.fetch({ id: result.insertId });
    if (reservationCreated.length === 0) {
      throw new NotFoundException('Reservation not found after creation');
    }
    const insertContentData = {
      id: result.insertId,
      description: reservationInput.content.description,
      innerParticipantNumber: reservationInput.content.innerParticipantNumber,
      outerParticipantNumber: reservationInput.content.outerParticipantNumber,
      food: reservationInput.content.food,
      desk: reservationInput.content.desk,
      chair: reservationInput.content.chair,
      busking: reservationInput.content.busking,
      workerNeed: reservationInput.content.workerNeed,
    } as InferInsertModel<typeof ReservationContent>;

    await this.db.insert(ReservationContent).values(insertContentData);
    const reservationContentCreated = await this.fetchContent(result.insertId);
    if (!reservationContentCreated) {
      throw new Error('Failed to create reservation content');
    }

    return [reservationCreated[0], reservationContentCreated];
  }

  async update(data: IReservationUpdate): Promise<[MReservationSimple, MReservationContent]> {
    const updateData = {
      userId: data.userId,
      title: data.title,
      timeFrom: data.timeFrom,
      timeTo: data.timeTo,
      timeUpdate: getNow(),
    } as Partial<InferInsertModel<typeof Reservation>>;

    const [result] = await this.db
      .update(Reservation)
      .set(updateData)
      .where(eq(Reservation.id, data.id));
    if (!result.affectedRows) {
      throw new Error('Failed to update reservation');
    }
    const reservationUpdated = await this.fetch({ id: data.id! });
    if (reservationUpdated.length === 0) {
      throw new NotFoundException('Reservation not found after update');
    }
    const updateContentData = {
      id: data.id!,
      description: data.content.description,
      innerParticipantNumber: data.content.innerParticipantNumber,
      outerParticipantNumber: data.content.outerParticipantNumber,
      food: data.content.food,
      desk: data.content.desk,
      chair: data.content.chair,
      busking: data.content.busking,
      workerNeed: data.content.workerNeed,
    } as InferInsertModel<typeof ReservationContent>;

    const [resultContent] = await this.db.update(ReservationContent).set(updateContentData).where(eq(ReservationContent.id, data.id!));
    if (!resultContent.affectedRows) {
      throw new Error('Failed to update reservation content');
    }

    const reservationContentUpdated = await this.fetchContent(data.id!);
    if (!reservationContentUpdated) {
      throw new NotFoundException('Reservation content not found after update');
    }

    return [reservationUpdated[0], reservationContentUpdated];
  }


  async delete(id: number): Promise<boolean> {
    const [result] = await this.db
      .delete(Reservation)
      .where(eq(Reservation.id, id));
    return result.affectedRows > 0;
  }
}