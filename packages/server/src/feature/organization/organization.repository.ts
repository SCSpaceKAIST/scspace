import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, Organization, OrganizationMember } from '@schema';
import { and, eq, inArray, SQL, InferInsertModel } from 'drizzle-orm';
import { IOrganization, IOrganizationCreate } from '@scspace-depot/types/organization';
import { MOrganization } from './organization.model';
import { formatDateToSQL } from '@scspace-server/common/util';

@Injectable()
export class OrganizationRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async fetch(userId: number): Promise<IOrganization[]>;
  async fetch(organizationIds: number[]): Promise<IOrganization[]>;
  async fetch(arg: number | number[]): Promise<IOrganization[]> {
    const whereConditions: SQL[] = [];

    if (Array.isArray(arg)) {
      const uniqueIds = [...new Set(arg)];
      whereConditions.push(inArray(Organization.id, uniqueIds));
    } else {
      whereConditions.push(eq(OrganizationMember.userId, arg));
    }

    const result = await this.db
      .select()
      .from(Organization)
      .innerJoin(OrganizationMember, eq(Organization.id, OrganizationMember.organizationId))
      .where(and(...whereConditions));

    if (result.length !== 1) {
      throw new NotFoundException('Organization not found');
    }

    const organizations = result.map((e) => e.organization);

    return organizations.map((organization) => MOrganization.fromDB(organization));
  }

  async fetchAll(): Promise<IOrganization[]> {
    const result = await this.db
      .select()
      .from(Organization);

    return result.map((e) => MOrganization.fromDB(e));
  }

  async fetchById(organizationId: number): Promise<IOrganization> {
    const result = await this.db
      .select()
      .from(Organization)
      .where(eq(Organization.id, organizationId));

    return MOrganization.fromDB(result[0]);
  }
  async insert(organization: IOrganizationCreate): Promise<IOrganization> {
    return await this.db.transaction(async (tx) => {
      const insertData = {
        name: organization.name,
        delegatorId: organization.delegatorId,
        timeRegister: formatDateToSQL(new Date()),
        timeUpdate: formatDateToSQL(new Date()),
      } as InferInsertModel<typeof Organization>;

      const [insertResult] = await tx.insert(Organization).values(insertData);
      const organizationId = insertResult.insertId;

      if (!organizationId) {
        throw new Error('Failed to insert organization');
      }

      const [newOrganization] = await tx
        .select()
        .from(Organization)
        .where(eq(Organization.id, organizationId));

      return MOrganization.fromDB(newOrganization);
    });
  }

  async delete(organizationId: number): Promise<void> {
    await this.db.delete(Organization).where(eq(Organization.id, organizationId));
  }
} 