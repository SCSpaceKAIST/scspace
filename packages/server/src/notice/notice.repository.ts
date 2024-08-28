import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { eq } from 'drizzle-orm';
import { NoticeType } from '@depot/types/notice';

@Injectable()
export class NoticeRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getNoticeAll(): Promise<NoticeType[] | false> {
    const result = await this.db.select().from(schema.notices);
    Logger.log('Notices ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }

  async getNoticeById(notice_id: number): Promise<NoticeType | false> {
    const result = await this.db
      .select()
      .from(schema.notices)
      .where(eq(schema.notices.id, notice_id));
    Logger.log('Notice by ID ' + JSON.stringify(result));
    return result.length > 0 ? result[0] : false;
  }

  async addNotice() {
    // await this.db.insert(schema.users).values(user);
    // Logger.log('ADD USER ' + JSON.stringify(user));
    // Logger.log(user.user_id);
  }
}
