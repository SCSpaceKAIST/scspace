import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, User } from 'src/db/schema';
import { and, eq, inArray, SQL } from 'drizzle-orm';
import { IUserCreate } from '@depot/types/user';
import { MUser } from './user.model';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  // TODO: params 방식으로 통일하기
  async find(id: number): Promise<MUser | null>;
  async find(kaistUID: string): Promise<MUser | null>;
  async find(params: {
    id?: number;
    kaistUID?: string;
    ids?: number[];
  }): Promise<MUser[]>;
  async find(
    arg: number | string | { id?: number; kaistUID?: string; ids?: number[] },
  ): Promise<MUser | null | MUser[]> {
    const whereConditions: SQL[] = [];
    if (typeof arg === 'number') {
      whereConditions.push(eq(User.id, arg));
    } else if (typeof arg === 'string') {
      whereConditions.push(eq(User.kaistUID, arg));
    } else {
      // typeof arg === 'object'
      if (arg.id) {
        whereConditions.push(eq(User.id, arg.id));
      }
      if (arg.kaistUID) {
        whereConditions.push(eq(User.kaistUID, arg.kaistUID));
      }
      if (arg.ids) {
        whereConditions.push(inArray(User.id, arg.ids));
      }
    }

    const user = await this.db
      .select()
      .from(User)
      .where(and(...whereConditions));

    if (typeof arg !== 'object') {
      if (user.length === 0) {
        return null;
      }
      return MUser.fromDB(user[0]);
    }

    return user.map((user) => MUser.fromDB(user));
  }

  async fetch(id: number): Promise<MUser> {
    const user = await this.find(id);
    if (user === null) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async fetchAll(ids: number[]): Promise<MUser[]> {
    if (ids.length === 0) {
      return [];
    }
    const uniqueIds = [...new Set(ids)];
    const whereConditions = [inArray(User.id, uniqueIds)];

    const users = await this.db
      .select()
      .from(User)
      .where(and(...whereConditions));

    if (users.length !== uniqueIds.length) {
      throw new NotFoundException('Some users not found');
    }

    return users.map((user) => MUser.fromDB(user));
  }

  async insert(user: IUserCreate) {
    const result = await this.db.insert(User).values(user);
    Logger.log('ADD USER ' + JSON.stringify(user));

    if ((await this.find(result[0].insertId)) === null) {
      return false;
    }

    return true;
  }
}
