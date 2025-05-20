import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { OrganizationMemberRepository } from './organization.member.repository';
import { IOrganization, IOrganizationCreate, IOrganizationResponse, IOrganizationMemberResponse } from '@scspace-depot/types/organization';
import { MOrganizationMember } from './organization.member.model';
import { UserRepository } from '../user/user.repository';
@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationMemberRepository: OrganizationMemberRepository,
    private readonly userRepository: UserRepository,
  ) { }

  async createOrganization(organization: IOrganizationCreate): Promise<IOrganization> {

    const newOrganization = await this.organizationRepository.insert(organization);
    const newOrganizationMember = await this.organizationMemberRepository.insert(newOrganization.id, organization.delegatorId);

    return newOrganization;
  }

  async getOrganizationsByUserId(userId: number): Promise<IOrganization[]> {
    const organizations = await this.organizationRepository.fetch(userId);
    if (!organizations) {
      throw new NotFoundException('Organizations not found');
    }
    const organizationMembers = await this.organizationMemberRepository.find({ userId });
    if (!organizationMembers) {
      throw new NotFoundException('Organization members not found');
    }
    return organizations;
  }

  async deleteOrganization(organizationId: number): Promise<void> {
    const organization = await this.organizationRepository.fetchById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    await this.organizationRepository.delete(organizationId);
  }

  async getOrganizations(): Promise<IOrganization[]> {
    return await this.organizationRepository.fetchAll();
  }

  async getOrganizationById(organizationId: number): Promise<IOrganizationResponse> {
    const organization = await this.organizationRepository.fetchById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const rawMembers = await this.organizationMemberRepository.find({ organizationId });
    const delegators = await this.userRepository.find({ id: organization.delegatorId });
    // Get all member users
    const memberUsers = await this.userRepository.find({
      ids: rawMembers.map(member => member.userId)
    });

    // Create member responses with user and organization info
    const members: IOrganizationMemberResponse[] = rawMembers.map(member => ({
      ...member,
      user: memberUsers.find(user => user.id === member.userId)!,
    }));

    return {
      ...organization,
      delegator: delegators[0],
      members,
    };
  }

  async getOrganizationMembers(organizationId: number): Promise<MOrganizationMember[]> {
    const organization = await this.organizationRepository.fetchById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return await this.organizationMemberRepository.find({ organizationId });
  }

  async addMember(organizationId: number, userId: number): Promise<MOrganizationMember> {
    const user = await this.userRepository.find({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const organization = await this.organizationRepository.fetchById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const organizationMember = await this.organizationMemberRepository.find({ organizationId, userId });
    if (organizationMember.length > 0) {
      throw new BadRequestException('User already in organization');
    }
    return await this.organizationMemberRepository.insert(organizationId, userId);
  }

  async removeMember(organizationId: number, userId: number): Promise<boolean> {
    const organization = await this.organizationRepository.fetchById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const organizationMember = await this.organizationMemberRepository.find({ organizationId, userId });
    if (!organizationMember) {
      throw new NotFoundException('User not in organization');
    }
    const result = await this.organizationMemberRepository.delete(organizationId, userId);
    return result;
  }
} 