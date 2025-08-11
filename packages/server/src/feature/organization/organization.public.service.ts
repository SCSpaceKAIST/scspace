import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { IOrganization, IOrganizationAll, IOrganizationMemberResponse, IOrganizationDelegator } from '@scspace-depot/types/organization';
import { UserPublicService } from '../user/user.public.service';
import { MOrganization } from './organization.model';
import { IUser } from '@scspace-depot/types/user';
import { MOrganizationMember } from './organization.member.model';
import { OrganizationMemberRepository } from './organization.member.repository';
import { OrganizationStatusEnum } from '@scspace-depot/enums/organization.enum';

@Injectable()
export class OrganizationPublicService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly userPublicService: UserPublicService,
    private readonly organizationMemberRepository: OrganizationMemberRepository,
  ) { }

  async fetchDeepById(organizationId: number): Promise<IOrganizationAll> {
    const organization = await this.fetchById(organizationId);
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }
    const delegator = await this.userPublicService.fetchById(organization.delegatorId);
    const members = await this.organizationMemberRepository.fetch({ organizationId: organizationId });

    const memberDetails = members.length > 0
      ? await this.fetchMemberDetails(members)
      : [];

    return {
      ...organization,
      delegator,
      members: memberDetails
    };
  }

  private async fetchMemberDetails(members: any[]): Promise<IOrganizationMemberResponse[]> {
    const memberModels = members.map(MOrganizationMember.fromDB);
    const memberUsers = await this.userPublicService.fetchAllByIds(
      memberModels.map(member => member.userId)
    );

    const memberDetailedModels = memberModels.map(member => {
      const user = memberUsers.find(user => user.id === member.userId);
      if (!user) {
        throw new NotFoundException(`User not found for member ${member.id}`);
      }
      return { ...member, user };
    });

    memberDetailedModels.sort((a, b) => (a.user.studentNumber - b.user.studentNumber));

    return memberDetailedModels;
  }

  async fetchAll(): Promise<IOrganizationDelegator[]> {
    const organizations = await this.organizationRepository.fetchAll();
    const delegators = await this.userPublicService.fetchAllByIds(organizations.map(organization => organization.delegatorId));
    return organizations.map(organization => ({
      ...organization,
      delegator: delegators.find(delegator => delegator.id === organization.delegatorId),
    }));
  }

  async fetchVerified(): Promise<IOrganizationDelegator[]> {
    const organizations = await this.organizationRepository.fetchAll();
    const delegators = await this.userPublicService.fetchAllByIds(organizations.map(org => org.delegatorId));
    return organizations
      .filter(org => org.status === OrganizationStatusEnum.VERIFIED)
      .map(org => ({
        ...org,
        delegator: delegators.find(delegator => delegator.id === org.delegatorId),
      }));
  }

  async fetchMembersById(organizationId: number): Promise<MOrganizationMember[]> {
    return (await this.organizationMemberRepository.fetch({ organizationId: organizationId })).map(MOrganizationMember.fromDB);
  }

  async insertMember(organizationId: number, userId: number): Promise<MOrganizationMember> {
    const userExist = await this.userPublicService.fetchById(userId);
    if (!userExist) {
      throw new NotFoundException('User not found');
    }
    const organizationExist = await this.fetchById(organizationId);
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

  async fetchDelegatorById(id: number): Promise<IUser> {
    const organization = await this.fetchById(id);
    return this.userPublicService.fetchById(organization.delegatorId);
  }

  async fetchByUserId(id: number): Promise<IOrganizationDelegator[]> {
    const organizations = await this.organizationRepository.fetch({ userId: id });
    if (organizations.length === 0) {
      return [];
    }
    const organizations2 = organizations.map(MOrganization.fromDB);
    const delegators = await this.userPublicService.fetchAllByIds(organizations2.map((e) => e.delegatorId));
    return organizations2.map((e) => ({
      ...e,
      delegator: delegators.find((d) => d.id === e.delegatorId),
    }));
  }

  async fetchByIds(ids: number[]): Promise<IOrganization[]> {
    const organizations = await this.organizationRepository.fetch({ ids: ids });
    if (organizations.length === 0) {
      return [];
    }
    return organizations.map(MOrganization.fromDB);
  }

  async fetchById(id: number): Promise<IOrganization | null> {
    const organization = await this.organizationRepository.fetch({ id: id });
    if (organization.length === 0) {
      return null;
    }
    return MOrganization.fromDB(organization[0]);
  }

  async count(): Promise<number> {
    return (await this.organizationRepository.fetchAll()).length;
  }
} 
