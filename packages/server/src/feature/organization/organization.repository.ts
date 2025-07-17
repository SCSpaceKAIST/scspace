import { Injectable, Inject, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, Organization, OrganizationMember } from '@schema';
import { and, eq, inArray, SQL, InferInsertModel, ne } from 'drizzle-orm';
import { IOrganizationCreate, IOrganizationUpdate } from '@scspace-depot/types/organization';
import { MOrganization } from './organization.model';
import { getNow } from '@scspace-server/common/utils';

@Injectable()
export class OrganizationRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) { }

  async fetch(params: {
    id?: number;
    ids?: number[];
    userId?: number;
  }): Promise<MOrganization[]> {
    const whereConditions: SQL[] = [];

    if (params.id) {
      whereConditions.push(eq(Organization.id, params.id));
    }
    if (params.ids) {
      const uniqueIds = [...new Set(params.ids)];
      whereConditions.push(inArray(Organization.id, uniqueIds));
    }
    if (params.userId) {
      whereConditions.push(eq(OrganizationMember.userId, params.userId));
    }

    const result = await this.db
      .select()
      .from(Organization)
      .leftJoin(OrganizationMember, eq(Organization.id, OrganizationMember.organizationId))
      .where(and(...whereConditions));

    return result.map((e) => e.organization);
  }

  async fetchAll(): Promise<MOrganization[]> {
    return await this.db
      .select()
      .from(Organization)
      .where(ne(Organization.id, 1));
  }

  async insert(organization: IOrganizationCreate): Promise<MOrganization> {
    const insertData = {
      name: organization.name,
      delegatorId: organization.delegatorId,
      timeRegister: getNow(),
      timeUpdate: getNow(),
    } as InferInsertModel<typeof Organization>;

    const [result] = await this.db.insert(Organization).values(insertData);
    if (!result.insertId) {
      throw new Error('Failed to get inserted ID');
    }

    const organizationCreated = await this.fetch({ id: result.insertId });
    if (organizationCreated.length === 0) {
      throw new NotFoundException('Organization not found after creation');
    }

    Logger.log('ADD ORGANIZATION ' + JSON.stringify(organization));
    return organizationCreated[0];
  }

  async update(organizationId: number, organization: IOrganizationUpdate): Promise<MOrganization> {
    const updateData = {
      id: organizationId,
      ...organization,
      timeUpdate: getNow(),
    } as InferInsertModel<typeof Organization>;

    const [result] = await this.db
      .update(Organization)
      .set(updateData)
      .where(
        eq(Organization.id, organizationId)
      );
    if (!result.affectedRows) {
      throw new Error('Failed to update organization');
    }

    const organizationUpdated = await this.fetch({ id: organizationId });
    if (organizationUpdated.length === 0) {
      throw new NotFoundException('Organization not found after update');
    }

    return organizationUpdated[0];
  }

  async delete(organizationId: number): Promise<void> {
    await this.db.delete(Organization).where(eq(Organization.id, organizationId));
  }
} 