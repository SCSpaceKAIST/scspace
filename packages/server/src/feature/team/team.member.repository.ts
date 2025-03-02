import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, TeamMember } from 'src/db/schema';
import { and, eq, inArray, SQL } from 'drizzle-orm';
import { MTeamMember } from './team.member.model';

@Injectable()
export class TeamMemberRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async find(id: number): Promise<MTeamMember | null> {
    const whereConditions: SQL[] = [];
    whereConditions.push(eq(TeamMember.id, id));

    const teamMember = await this.db
      .select()
      .from(TeamMember)
      .where(and(...whereConditions));

    if (teamMember.length === 0) {
      return null;
    }

    return MTeamMember.fromDB(teamMember[0]);
  }

  async fetch(id: number): Promise<MTeamMember> {
    const teamMember = await this.find(id);
    if (teamMember === null) {
      throw new NotFoundException('Team not found');
    }

    return teamMember;
  }

  async fetchAll(ids: number[]): Promise<MTeamMember[]>;
  async fetchAll(teamId: number): Promise<MTeamMember[]>;
  async fetchAll(arg: number[] | number): Promise<MTeamMember[]> {
    const whereConditions: SQL[] = [];

    if (Array.isArray(arg)) {
      const uniqueIds = [...new Set(arg)];
      whereConditions.push(inArray(TeamMember.id, uniqueIds));
    } else {
      whereConditions.push(eq(TeamMember.teamId, arg));
    }

    const teamMembers = await this.db
      .select()
      .from(TeamMember)
      .where(and(...whereConditions));

    if (Array.isArray(arg)) {
      const uniqueIds = [...new Set(arg)];
      if (teamMembers.length !== uniqueIds.length) {
        throw new NotFoundException('Some teamMembers not found');
      }
    } else {
      if (teamMembers.length === 0) {
        throw new NotFoundException('Team not found');
      }
    }

    return teamMembers.map((teamMember) => MTeamMember.fromDB(teamMember));
  }

  async fetchAllByUserId(userId: number): Promise<MTeamMember[]> {
    const teamMembers = await this.db
      .select()
      .from(TeamMember)
      .where(eq(TeamMember.userId, userId));

    return teamMembers.map((teamMember) => MTeamMember.fromDB(teamMember));
  }

  async fetchUnionAll(teamIds: number[]): Promise<MTeamMember[]> {
    const teamMembers = await this.db
      .select()
      .from(TeamMember)
      .where(inArray(TeamMember.teamId, teamIds));

    return teamMembers.map((teamMember) => MTeamMember.fromDB(teamMember));
  }
}
