import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { UserTypeWithoutID } from '@depot/types/user';
import { UserType } from '@depot/types/user';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getUser(user_id: string): Promise<UserType | false> {
    // const user = await this.db.query.users.findFirst({
    //   where: eq(schema.users.user_id, user_id),
    // });
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.user_id, user_id));
    Logger.log('USERS ' + JSON.stringify(user));
    return user.length > 0 ? user[0] : false;
  }

  async addUser(user: UserTypeWithoutID) {
    await this.db.insert(schema.users).values(user);
    Logger.log('ADD USER ' + JSON.stringify(user));
    Logger.log(user.user_id);
  }
}
