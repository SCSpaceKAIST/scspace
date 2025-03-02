import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Faq, schema } from '@schema';
import { eq } from 'drizzle-orm';
import { MFaq } from './faq.model';
import { IFaq } from '@depot/types/faq';

@Injectable()
export class FaqRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async fetchAll(): Promise<MFaq[]> {
    const result = await this.db.select().from(Faq);
    return result.map((faq) => MFaq.fromDB(faq));
  }

  async fetch(id: number): Promise<MFaq> {
    const result = await this.db.select().from(Faq).where(eq(Faq.id, id));
    if (result.length === 0) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return MFaq.fromDB(result[0]);
  }

  async update(faq: IFaq): Promise<boolean> {
    const dbFaq = MFaq.toDB(faq);
    await this.db.update(Faq).set(dbFaq).where(eq(Faq.id, faq.id));
    const fetched = await this.fetch(faq.id);
    return !!fetched;
  }
}
