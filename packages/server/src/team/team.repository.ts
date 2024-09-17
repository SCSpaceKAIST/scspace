import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { TeamType } from '@depot/types/reservation';

@Injectable()
export class TeamRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getAll(): Promise<TeamType[] | false> {
    const result = (await this.db.select().from(schema.teams)) as TeamType[];
    Logger.log('Teams ' + JSON.stringify(result));
    return result ? result : false;
  }

  async getTeamsByUserId(userId: string): Promise<TeamType[] | false> {
    try {
      const semesterId = await this.getSemesterNow();
      const result = (await this.db
        .select({
          team_id: schema.teams.team_id,
          name: schema.teams.name,
          delegator_id: schema.teams.delegator_id,
          time_register: schema.teams.time_register,
          semester_id: schema.teams.semester_id,
        })
        .from(schema.teams)
        .innerJoin(
          schema.team_members,
          eq(schema.teams.team_id, schema.team_members.team_id),
        )
        .where(
          and(
            eq(schema.team_members.user_id, userId),
            eq(schema.teams.semester_id, semesterId),
          ),
        )) as TeamType[];
      Logger.log('Teams with ID: ' + JSON.stringify(result));
      return result ? result : false;
    } catch (error) {
      console.error('Error fetching teams for user:', error);
      throw error;
    }
  }

  async getSemesterNow(): Promise<string> {
    const res = await this.db.select().from(schema.semesters);
    Logger.log('Semesters: ' + JSON.stringify(res));
    const now = new Date();
    Logger.log('Now: ' + now);
    const result = (await this.db
      .select({
        semester_id: schema.semesters.semester_id,
      })
      .from(schema.semesters)
      .where(
        and(
          lte(schema.semesters.date_from, now),
          gte(schema.semesters.date_to, now),
        ),
      )) as { semester_id: string }[];
    Logger.log('Semester now: ' + JSON.stringify(result));
    return result[0].semester_id;
  }
}
