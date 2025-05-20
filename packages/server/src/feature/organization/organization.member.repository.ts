import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, OrganizationMember } from 'src/db/schema';
import { and, eq, inArray, SQL } from 'drizzle-orm';
import { MOrganizationMember } from './organization.member.model';
import { formatDateToSQL } from '@scspace-server/common/util';

@Injectable()
export class OrganizationMemberRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async find(params: {
    organizationId?: number;
    userId?: number;
    organizationIds?: number[];
  }): Promise<MOrganizationMember[]> {
    const whereConditions: SQL[] = [];

    if (params.organizationId) {
      whereConditions.push(eq(OrganizationMember.organizationId, params.organizationId));
    }
    if (params.userId) {
      whereConditions.push(eq(OrganizationMember.userId, params.userId));
    }
    if (params.organizationIds) {
      whereConditions.push(inArray(OrganizationMember.organizationId, params.organizationIds));
    }

    const members = await this.db
      .select()
      .from(OrganizationMember)
      .where(and(...whereConditions));

    return members.map((member) => MOrganizationMember.fromDB(member));
  }

  async insert(organizationId: number, userId: number): Promise<MOrganizationMember> {
    const [result] = await this.db
      .insert(OrganizationMember)
      .values({
        organizationId,
        userId,
        timeRegister: formatDateToSQL(new Date()),
      })
      .$returningId();

    if (!result) {
      throw new NotFoundException('Organization member not found');
    }

    const member = await this.find({ organizationId, userId });
    if (member.length === 0) {
      throw new NotFoundException('Organization member not found after creation');
    }

    return member[0];
  }

  async delete(organizationId: number, userId: number): Promise<boolean> {
    const result = await this.db
      .delete(OrganizationMember)
      .where(
        and(
          eq(OrganizationMember.organizationId, organizationId),
          eq(OrganizationMember.userId, userId),
        ),
      );

    if (!result) {
      throw new NotFoundException('Organization member not found');
    }
    return true;
  }
} 