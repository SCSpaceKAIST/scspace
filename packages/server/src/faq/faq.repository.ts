import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class FaqRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getFaqAll() {
    const result = await this.db.select().from(schema.faqs);
    Logger.log('FAQs ' + JSON.stringify(result));
    return result.length > 0 ? result[0] : false;
  }

  async getFaqById(faq_id: number) {
    const result = await this.db
      .select()
      .from(schema.faqs)
      .where(eq(schema.faqs.id, faq_id));
    Logger.log('FAQ by ID ' + JSON.stringify(result));
    return result.length > 0 ? result[0] : false;
  }

  async addFaq() {
    // await this.db.insert(schema.users).values(user);
    // Logger.log('ADD USER ' + JSON.stringify(user));
    // Logger.log(user.user_id);
  }
}
