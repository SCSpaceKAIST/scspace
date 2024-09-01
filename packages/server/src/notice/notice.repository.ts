import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { eq, sql } from 'drizzle-orm';
import { NoticeInputType, NoticeType } from '@depot/types/notice';

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

  async addNotice(noticeContent: NoticeInputType): Promise<Boolean> {
    const prev = await this.getNoticeAll();
    const newNotice = {
      ...noticeContent,
      time_post: new Date(),
      views: 0,
    };
    Logger.log('ADD Notice ' + JSON.stringify(newNotice));
    await this.db.insert(schema.notices).values(newNotice);
    const post = await this.getNoticeAll();
    return prev && post ? prev.length !== post.length : false;
  }
  async incrementViewsById(id: number) {
    await this.db
      .update(schema.notices)
      .set({
        views: sql`${schema.notices.views} + 1`,
      })
      .where(eq(schema.notices.id, id));
  }
}
