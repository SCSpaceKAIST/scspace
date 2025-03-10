import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Notice, schema } from '@schema';
import { eq } from 'drizzle-orm';
import { INotice, INoticeCreate } from '@scspace-depot/types/notice';
import { MNotice } from './notice.model';

@Injectable()
export class NoticeRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async fetchAll(): Promise<MNotice[]> {
    const result = await this.db.select().from(Notice);
    return result.map((notice) => MNotice.fromDB(notice));
  }

  async fetch(id: number): Promise<MNotice> {
    const result = await this.db.select().from(Notice).where(eq(Notice.id, id));
    if (result.length === 0) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }
    return MNotice.fromDB(result[0]);
  }

  async insertNotice(noticeContent: INoticeCreate): Promise<boolean> {
    const res = await this.db.insert(Notice).values(noticeContent);

    const notice = await this.fetch(res[0].insertId);
    return !!notice;
  }

  async update(notice: INotice): Promise<boolean> {
    const dbNotice = MNotice.toDB(notice);
    await this.db.update(Notice).set(dbNotice).where(eq(Notice.id, notice.id));
    return true;
  }
}
