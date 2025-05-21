import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { OrganizationMemberRepository } from './organization.member.repository';
import { IOrganization, IOrganizationAll, IOrganizationCreate, IOrganizationDelegator, IOrganizationMemberResponse, IOrganizationUpdate } from '@scspace-depot/types/organization';
import { MOrganizationMember } from './organization.member.model';
import { ISuccessResponse } from '@scspace-depot/types/common';
import { UserPublicService } from '../user/user.public.service';
import { MOrganization } from './organization.model';
import { OrganizationPublicService } from './organization.public.service';
import { formatDateToSQL } from '@scspace-server/common/util';
import { Organization } from '@scspace-server/db/schema';
import { InferInsertModel } from 'drizzle-orm';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationMemberRepository: OrganizationMemberRepository,
    private readonly organizationPublicService: OrganizationPublicService,
    private readonly userPublicService: UserPublicService,
  ) { }
  async getDeepById(organizationId: number): Promise<IOrganizationAll> {
    const organization = await this.organizationPublicService.fetchById(organizationId);
    const delegator = await this.userPublicService.fetchById(organization.delegatorId);
    const members = await this.organizationMemberRepository.fetch({ organizationId: organizationId });

    const memberDetails = members.length > 0 
      ? await this.getMemberDetails(members)
      : [];

    return {
      ...organization,
      delegator,
      members: memberDetails,
    };
  }

  private async getMemberDetails(members: any[]): Promise<IOrganizationMemberResponse[]> {
    const memberModels = members.map(MOrganizationMember.fromDB);
    const memberUsers = await this.userPublicService.fetchAllByIds(
      memberModels.map(member => member.userId)
    );

    return memberModels.map(member => {
      const user = memberUsers.find(user => user.id === member.userId);
      if (!user) {
        throw new NotFoundException(`User not found for member ${member.id}`);
      }
      return { ...member, user };
    });
  }

  async getAll(): Promise<IOrganizationDelegator[]> {
    const organizations = await this.organizationPublicService.fetchAll();
    const delegators = await this.userPublicService.fetchAllByIds(organizations.map(organization => organization.delegatorId));
    return organizations.map(organization => ({
      ...organization,
      delegator: delegators.find(delegator => delegator.id === organization.delegatorId),
    }));
  }

  async getMembersById(organizationId: number): Promise<MOrganizationMember[]> {
    return (await this.organizationMemberRepository.fetch({ organizationId: organizationId })).map(MOrganizationMember.fromDB);
  }

  async insertMember(organizationId: number, userId: number): Promise<MOrganizationMember> {
    const userExist = await this.userPublicService.fetchById(userId);
    if (!userExist) {
      throw new NotFoundException('User not found');
    }
    const organizationExist = await this.organizationPublicService.fetchById(organizationId);
    if (!organizationExist) {
      throw new NotFoundException('Organization not found');
    }
    const organizationMemberExist = await this.organizationMemberRepository.fetch({ organizationId, userId });
    if (organizationMemberExist.length > 0) {
      throw new BadRequestException('User already in organization');
    }
    const newOrganizationMember = await this.organizationMemberRepository.insert(organizationId, userId);
    return MOrganizationMember.fromDB(newOrganizationMember);
  }

  async deleteMember(organizationId: number, userId: number): Promise<ISuccessResponse> {
    const organizationExist = await this.organizationPublicService.fetchById(organizationId);
    if (!organizationExist) {
      throw new NotFoundException('Organization not found');
    }
    const organizationMemberExist = await this.organizationMemberRepository.fetch({ organizationId, userId });
    if (organizationMemberExist.length === 0) {
      throw new NotFoundException('User not in organization');
    }
    await this.organizationMemberRepository.delete(organizationId, userId);
    return { success: true };
  }

  async insert(organization: IOrganizationCreate): Promise<IOrganization> {
    const delegator = await this.userPublicService.fetchById(organization.delegatorId);
    if (!delegator) {
      throw new NotFoundException('Delegator not found');
    }
    const newOrganization = await this.organizationRepository.insert(organization);
    await this.organizationMemberRepository.insert(newOrganization.id, organization.delegatorId);
    return MOrganization.fromDB(newOrganization);
  }

  async update(organizationId: number, organizationNew: IOrganizationUpdate): Promise<IOrganization> {
    const organization: IOrganization = await this.organizationPublicService.fetchById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const delegator = await this.userPublicService.fetchById(organizationNew.delegatorId);
    if (!delegator) {
      throw new NotFoundException('Delegator not found');
    }
    const updateData: IOrganization = {
      id: organizationId,
      name: organizationNew.name,
      delegatorId: organizationNew.delegatorId,
      timeRegister: organization.timeRegister,
      timeUpdate: formatDateToSQL(new Date()),
    };

    const updatedOrganization = await this.organizationRepository.update(organizationId, updateData);
    return MOrganization.fromDB(updatedOrganization);
  }

  async delete(organizationId: number): Promise<ISuccessResponse> {
    const organization = await this.organizationPublicService.fetchById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    await this.organizationRepository.delete(organizationId);

    return { success: true };
  }
} 