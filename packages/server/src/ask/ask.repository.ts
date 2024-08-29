import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { eq } from 'drizzle-orm';
import { AskType } from '@depot/types/ask';

@Injectable()
export class AskRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getAskAll(): Promise<AskType[] | false> {
    const result = await this.db.select().from(schema.asks);
    Logger.log('Asks ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }

  async getAskById(ask_id: number): Promise<AskType | false> {
    const result = await this.db
      .select()
      .from(schema.asks)
      .where(eq(schema.asks.id, ask_id));
    Logger.log('Ask by ID ' + JSON.stringify(result));
    return result.length > 0 ? result[0] : false;
  }

  async addAsk() {
    // await this.db.insert(schema.users).values(user);
    // Logger.log('ADD USER ' + JSON.stringify(user));
    // Logger.log(user.user_id);
  }
}
