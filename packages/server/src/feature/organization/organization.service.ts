import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { OrganizationMemberRepository } from './organization.member.repository';
import { IOrganization } from '@scspace-depot/types/organization';
import { MOrganizationMember } from './organization.member.model';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationMemberRepository: OrganizationMemberRepository,
  ) {}

  async createOrganization(organization: IOrganization): Promise<IOrganization> {
    return await this.organizationRepository.insert(organization);
  }

  async getOrganizationsByUserId(userId: number): Promise<IOrganization[]> {
    return await this.organizationRepository.fetch(userId);
  }

  async getOrganizations(): Promise<IOrganization[]> {
    return await this.organizationRepository.fetchAll();
  }

  async getOrganizationMembers(organizationId: number): Promise<MOrganizationMember[]> {
    return await this.organizationMemberRepository.find({ organizationId });
  }

  async addMember(organizationId: number, userId: number): Promise<MOrganizationMember> {
    return await this.organizationMemberRepository.insert(organizationId, userId);
  }

  async removeMember(organizationId: number, userId: number): Promise<void> {
    await this.organizationMemberRepository.delete(organizationId, userId);
  }
} 