import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Ask, schema } from '@schema';
import { and, eq, inArray, SQL } from 'drizzle-orm';
import { IAsk, IAskCreate } from '@scspace-depot/types/ask';
import { AskStateEnum } from '@scspace-depot/enums/ask.enum';
import { MAsk } from './ask.model';

@Injectable()
export class AskRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async find(params: {
    id?: number;
    ids?: number[];
    states?: AskStateEnum[];
  }): Promise<MAsk[]> {
    const whereClause: SQL[] = [];
    if (params.id) whereClause.push(eq(Ask.id, params.id));
    if (params.ids) whereClause.push(inArray(Ask.id, params.ids));
    if (params.states) whereClause.push(inArray(Ask.state, params.states));

    const result = await this.db
      .select()
      .from(Ask)
      .where(and(...whereClause));
    Logger.log('Asks ' + JSON.stringify(result));

    return result.map((ask) => MAsk.fromDB(ask));
  }

  async update(ask: IAsk): Promise<boolean> {
    const [result] = await this.db
      .update(Ask)
      .set(ask)
      .where(eq(Ask.id, ask.id));

    return result.insertId ? true : false;
  }

  async insert(content: IAskCreate): Promise<boolean> {
    const [result] = await this.db.insert(Ask).values(content);

    return result.insertId ? true : false;
  }
}
