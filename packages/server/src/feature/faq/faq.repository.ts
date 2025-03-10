import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Faq, schema } from '@schema';
import { and, eq, inArray, SQL } from 'drizzle-orm';
import { MFaq } from './faq.model';
import { IFaq } from '@scspace-depot/types/faq';

type IFaqQuery = {
  id?: number;
  ids?: number[];
};

@Injectable()
export class FaqRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async find(params: IFaqQuery): Promise<MFaq[]> {
    const whereConditions: SQL[] = [];
    if (params.id) {
      whereConditions.push(eq(Faq.id, params.id));
    }
    if (params.ids) {
      whereConditions.push(inArray(Faq.id, params.ids));
    }

    const faqs = await this.db
      .select()
      .from(Faq)
      .where(and(...whereConditions));
    return faqs.map((faq) => MFaq.fromDB(faq));
  }

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
