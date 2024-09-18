import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { and, asc, eq, gt, gte, lt, or, sql } from 'drizzle-orm';
import { PasswordType, PasswordValidationType } from '@depot/types/password';

@Injectable()
export class PasswordRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async validAll(): Promise<PasswordType[] | false> {
    const result = (await this.db
      .select()
      .from(schema.passwords)
      .where(gt(schema.passwords.changed, 0))) as PasswordType[];
    Logger.log('Passwords: ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }

  async validSpaceCheck(
    user_id: string,
    space_id: number,
    timeFrom: Date,
  ): Promise<boolean> {
    const result = await this.db
      .select({
        total_reserved_time: sql`COALESCE(SUM(TIMESTAMPDIFF(MINUTE, ${schema.reservations.time_from}, ${schema.reservations.time_to})), 0)`,
      })
      .from(schema.reservations)
      .where(
        and(
          eq(schema.reservations.user_id, user_id),
          eq(schema.reservations.space_id, space_id),
          eq(schema.reservations.state, 'grant'), // 승인된 예약만
          sql`WEEK(${schema.reservations.time_from}) = WEEK(${timeFrom})`, // 같은 주의 예약
          sql`YEAR(${schema.reservations.time_from}) = YEAR(${timeFrom})`, // 같은 연도 내의 예약
        ),
      );

    Logger.log('Weekly reservation time: ' + JSON.stringify(result));
    // 예약된 시간이 없을 경우 0을 반환
    return Number(result[0]?.total_reserved_time) > 0;
  }
}
