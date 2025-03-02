import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, Team, TeamMember } from '@schema';
import { and, eq, inArray, SQL } from 'drizzle-orm';
import { ITeam } from '@depot/types/reservation';
import { MTeam } from './team.model';

@Injectable()
export class TeamRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async fetchAll(userId: number): Promise<ITeam[]>;
  async fetchAll(ids: number[]): Promise<ITeam[]>;
  async fetchAll(arg: number[] | number): Promise<ITeam[]> {
    const whereConditions: SQL[] = [];

    if (Array.isArray(arg)) {
      const uniqueIds = [...new Set(arg)];
      whereConditions.push(inArray(Team.id, uniqueIds));
    } else {
      whereConditions.push(eq(TeamMember.userId, arg));
    }
    const result = await this.db
      .select()
      .from(Team)
      .innerJoin(TeamMember, eq(Team.id, TeamMember.teamId))
      .where(and(...whereConditions));

    if (Array.isArray(arg)) {
      const uniqueIds = [...new Set(arg)];
      if (result.length !== uniqueIds.length) {
        throw new NotFoundException('Some teams not found');
      }
    } else {
      if (result.length === 0) {
        throw new NotFoundException('Team not found');
      }
    }

    const teams = result.map((e) => e.team);

    return teams.map((team) => MTeam.fromDB(team));
  }
}
