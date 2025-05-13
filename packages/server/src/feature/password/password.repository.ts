import { Injectable, Inject } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Password, schema } from '@schema';
import { and, eq, SQL } from 'drizzle-orm';
import { MPassword } from './password.model';

@Injectable()
export class PasswordRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async find(params: { id?: number; changed?: boolean }): Promise<MPassword[]> {
    // TODO: 제일 최신의 것만 조회하는 로직 추가
    const whereClause: SQL[] = [];
    if (params.id) whereClause.push(eq(Password.id, params.id));
    if (params.changed) whereClause.push(eq(Password.changed, params.changed));

    const result = await this.db
      .select()
      .from(Password)
      .where(and(...whereClause));

    return result.map((password) => MPassword.fromDB(password));
  }
}
