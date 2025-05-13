import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, Semester } from 'src/db/schema';
import { and, between, eq, inArray, or, SQL } from 'drizzle-orm';
import { MSemester } from './semester.model';

interface ISemesterQuery {
  id?: number;
  year?: number;
  season?: number;
  ids?: number[];
  time?: Date;
  duration?: {
    from: Date;
    to: Date;
  };
}

@Injectable()
export class SemesterRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async find(params: ISemesterQuery): Promise<MSemester[]> {
    const whereConditions: SQL[] = [];
    if (params.id) {
      whereConditions.push(eq(Semester.id, params.id));
    }
    if (params.year) {
      whereConditions.push(eq(Semester.year, params.year));
    }
    if (params.season) {
      whereConditions.push(eq(Semester.season, params.season));
    }
    if (params.ids) {
      whereConditions.push(inArray(Semester.id, params.ids));
    }
    if (params.time) {
      whereConditions.push(eq(Semester.dateFrom, params.time));
    }
    if (params.duration) {
      whereConditions.push(
        or(
          between(Semester.dateFrom, params.duration.from, params.duration.to),
          between(Semester.dateTo, params.duration.from, params.duration.to),
        ),
      );
    }

    const semesters = await this.db
      .select()
      .from(Semester)
      .where(and(...whereConditions));

    return semesters.map((semester) => MSemester.fromDB(semester));
  }

  async findOne(id: number): Promise<MSemester | null> {
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
    const semester = await this.findOne(id);
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
