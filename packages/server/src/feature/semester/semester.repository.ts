import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, Semester } from 'src/db/schema';
import { and, eq, inArray, SQL } from 'drizzle-orm';
import { MSemester } from './semester.model';

@Injectable()
export class SemesterRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async find(id: number): Promise<MSemester | null> {
    const whereConditions: SQL[] = [];
    whereConditions.push(eq(Semester.id, id));

    const semester = await this.db
      .select()
      .from(Semester)
      .where(and(...whereConditions));

    if (semester.length === 0) {
      return null;
    }

    return MSemester.fromDB(semester[0]);
  }

  async fetch(id: number): Promise<MSemester> {
    const semester = await this.find(id);
    if (semester === null) {
      throw new NotFoundException('Semester not found');
    }

    return semester;
  }

  async fetchAll(ids: number[]): Promise<MSemester[]> {
    const uniqueIds = [...new Set(ids)];
    const whereConditions = [inArray(Semester.id, uniqueIds)];

    const semesters = await this.db
      .select()
      .from(Semester)
      .where(and(...whereConditions));

    if (semesters.length !== uniqueIds.length) {
      throw new NotFoundException('Some semesters not found');
    }

    return semesters.map((semester) => MSemester.fromDB(semester));
  }
}
