import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, OrganizationMember, Organization } from 'src/db/schema';
import { and, eq, inArray, SQL, InferInsertModel } from 'drizzle-orm';
import { MOrganizationMember } from './organization.member.model';
import { getNow } from '@scspace-server/common/utils';

@Injectable()
export class OrganizationMemberRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) { }

  async fetch(params: {
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

    return members;
  }

  async insert(organizationId: number, userId: number): Promise<MOrganizationMember> {
    const insertData = {
      organizationId,
      userId,
      timeRegister: getNow(),
    } as InferInsertModel<typeof OrganizationMember>;

    await this.db.insert(OrganizationMember).values(insertData);
    await this.db.update(Organization).set({ timeUpdate: getNow(), }).where(eq(Organization.id, organizationId));

    const organizationMember = await this.fetch({ organizationId, userId });
    if (organizationMember.length === 0) {
      throw new NotFoundException('Organization member not found');
    }
    Logger.log('ADD ORGANIZATION MEMBER ' + JSON.stringify(insertData));

    return organizationMember[0];
  }

  async delete(organizationId: number, userId: number): Promise<void> {
    await this.db
      .delete(OrganizationMember)
      .where(
        and(
          eq(OrganizationMember.organizationId, organizationId),
          eq(OrganizationMember.userId, userId),
        ),
      );
  }
} 