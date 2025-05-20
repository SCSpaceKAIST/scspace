import { Injectable, Inject, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, User } from 'src/db/schema';
import { and, eq, inArray, SQL } from 'drizzle-orm';
import { IUserCreate } from '@scspace-depot/types/user';
import { MUser } from './user.model';
import { takeOne } from 'src/common/util';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async find(params: {
    id?: number;
    ids?: number[];
    studentNumber?: number;
  }): Promise<MUser[]> {
    const whereConditions: SQL[] = [];
    
    if (params.id) {
      whereConditions.push(eq(User.id, params.id));
    }
    if (params.ids) {
      whereConditions.push(inArray(User.id, params.ids));
    }
    if (params.studentNumber) {
      whereConditions.push(eq(User.studentNumber, params.studentNumber));
    }


    const users = await this.db
      .select()
      .from(User)
      .where(and(...whereConditions));

    return users.map((user) => MUser.fromDB(user));
  }

  async findOne(id: number): Promise<MUser | null> {
    const users = await this.find({ id });
    console.log(users);
    return users.length > 0 ? users[0] : null;
  }

  async fetch(id: number): Promise<MUser> {
    if (id === 0) {
      throw new NotFoundException('User not found');
    }
    const user = await this.findOne(id);
    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async fetchAllByIds(ids: number[]): Promise<MUser[]> {
    if (ids.length === 0) {
      return [];
    }
    const uniqueIds = [...new Set(ids)];
    const users = await this.find({ ids: uniqueIds });

    if (users.length !== uniqueIds.length) {
      throw new NotFoundException('Some users not found');
    }

    return users;
  }

  async fetchAll(): Promise<MUser[]> {
    const users = await this.find({});
    return users;
  }

  async insert(user: IUserCreate): Promise<MUser> {
    const userExist = await this.find({ studentNumber: user.studentNumber });
    if (userExist.length > 0) {
      throw new BadRequestException('User already exists');
    }
    const result = await this.db.insert(User).values(user).$returningId();
    Logger.log('ADD USER ' + JSON.stringify(user));

    if (!result) {
      throw new NotFoundException('User not found');
    }

    const userCreated = await this.findOne(result[0].id);
    if (!userCreated) {
      throw new NotFoundException('User not found after creation');
    }
    return userCreated;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(User).where(eq(User.id, id));
    return result.length > 0;
  }
}
