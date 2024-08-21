import { Injectable, Inject } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getUser(user_id: string) {
    // const user = await this.db.query.users.findFirst({
    //   where: eq(schema.users.userId, user_id),
    // });
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.userId, user_id));
    return user[0];
  }
}
