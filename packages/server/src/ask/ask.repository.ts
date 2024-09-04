import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { eq, sql } from 'drizzle-orm';
import { AskInputType, AskType } from '@depot/types/ask';

@Injectable()
export class AskRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getAll(): Promise<AskType[] | false> {
    const result = (await this.db.select().from(schema.asks)) as AskType[];
    Logger.log('Asks ' + JSON.stringify(result));
    return result ? result : false;
  }

  async getById(id: number): Promise<AskType | false> {
    const result = (await this.db
      .select()
      .from(schema.asks)
      .where(eq(schema.asks.id, id))) as AskType[];
    Logger.log('Ask by ID ' + JSON.stringify(result));
    return result.length > 0 ? result[0] : false;
  }

  async add(content: AskInputType): Promise<Boolean> {
    const prev = await this.getAll();
    const newObj = {
      ...content,
      time_post: new Date(),
      views: 0,
      state: 'wait',
    } as AskType;
    Logger.log('ADD Ask ' + JSON.stringify(newObj));
    await this.db.insert(schema.asks).values(newObj);
    const post = await this.getAll();
    return prev && post ? prev.length !== post.length : false;
  }
  async incrementViewsById(id: number) {
    await this.db
      .update(schema.asks)
      .set({
        views: sql`${schema.asks.views} + 1`,
      })
      .where(eq(schema.asks.id, id));
  }

  async addComment(content: AskType) {
    await this.db
      .update(schema.asks)
      .set({
        comment: content.comment,
        commenter_id: content.commenter_id,
        state: content.state,
      })
      .where(eq(schema.asks.id, content.id));
  }
}
