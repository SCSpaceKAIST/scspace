import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, User } from 'src/db/schema';
import { and, asc, desc, eq, gt, inArray, InferInsertModel, like, sql } from 'drizzle-orm';
import { IUserCreate, IUserUpdate } from '@scspace-depot/types/user';
import { MUser } from './user.model';
import { UserAuthBinaryEnum } from '@scspace-depot/enums/user.enum';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) { }

  async fetch(params: {
    id?: number;
    ids?: number[];
    studentNumber?: number;
    type?: number;
  }): Promise<MUser[]> {
    const whereConditions = [];

    if (params.id) {
      whereConditions.push(eq(User.id, params.id));
    }
    if (params.ids) {
      whereConditions.push(inArray(User.id, params.ids));
    }
    if (params.studentNumber) {
      whereConditions.push(eq(User.studentNumber, params.studentNumber));
    }
    if (params.type) {
      whereConditions.push(eq(User.type, params.type));
    }

    const users = await this.db
      .select()
      .from(User)
      .where(and(...whereConditions))
      .orderBy(
        asc(User.studentNumber)
      );

    return users;
  }

  async fetchAllWorker(): Promise<MUser[]> {
    const users = await this.db
      .select()
      .from(User)
      // Use raw SQL to evaluate bitwise AND and compare to 0
      .where(gt(sql`${User.type} & ${UserAuthBinaryEnum.WORKER}`, 0))
      .orderBy(
        asc(User.studentNumber)
      );

    return users;
  }

  async fetchAll(
    studentNumber: number
  ): Promise<MUser[]> {
    const whereConditions = [];

    if (studentNumber != 0)
      whereConditions.push(like(User.studentNumber, `${studentNumber}%`))

    const users = await this.db
      .select()
      .from(User)
      .where(and(...whereConditions))
      .orderBy(
        desc(User.type),
        asc(User.studentNumber)
      );
    return users;
  }

  async insert(user: IUserCreate): Promise<MUser> {
    const insertData = {
      studentNumber: user.studentNumber,
      nameKr: user.nameKr,
      nameEn: user.nameEn,
      email: user.email,
    } as InferInsertModel<typeof User>;

    const [result] = await this.db.insert(User).values(insertData);
    if (!result.insertId) {
      throw new Error('Failed to get inserted ID');
    }

    const userCreated = await this.fetch({ id: result.insertId });
    if (userCreated.length === 0) {
      throw new NotFoundException('User not found after creation');
    }
    Logger.log('ADD USER ' + JSON.stringify(user));
    return userCreated[0];
  }

  async updateType(id: number, user: IUserUpdate): Promise<MUser> {
    // undefined 필드를 제거하여 빈 객체 전달 방지
    const updateData: Partial<typeof User.$inferSelect> = {};
    if (user.type !== undefined) {
      updateData.type = user.type;
    }
    if (user.timeOverdue !== undefined) {
      updateData.timeOverdue = user.timeOverdue;
    }

    await this.db
      .update(User)
      .set(updateData)
      .where(eq(User.id, id));

    const updatedUser = await this.fetch({ id: id });
    if (updatedUser.length === 0) {
      throw new NotFoundException(`User ID ${id} not found after update.`);
    }
    Logger.log('UPDATE USER ' + JSON.stringify(user));
    return updatedUser[0];
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(User).where(eq(User.id, id));
  }
}
