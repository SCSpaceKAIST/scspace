import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { eq, sql } from 'drizzle-orm';
import { ReservationType } from '@depot/types/reservation';

@Injectable()
export class ReservationRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getReservationAll(): Promise<ReservationType[] | false> {
    const result = (await this.db
      .select()
      .from(schema.reservations)) as ReservationType[];
    Logger.log('Reservations: ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }

  async getReservationBySpaceID(
    space_id: number,
  ): Promise<ReservationType[] | false> {
    const result = (await this.db
      .select()
      .from(schema.reservations)
      .where(eq(schema.reservations.space_id, space_id))) as ReservationType[];
    Logger.log('Space ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }
}
