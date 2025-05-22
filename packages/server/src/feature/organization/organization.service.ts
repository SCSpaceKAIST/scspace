import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { OrganizationMemberRepository } from './organization.member.repository';
import { IOrganization, IOrganizationCreate, IOrganizationUpdate } from '@scspace-depot/types/organization';
import { MOrganization } from './organization.model';
import { OrganizationPublicService } from './organization.public.service';
import { UserPublicService } from '../user/user.public.service';
import { ISuccessResponse } from '@scspace-depot/types/common';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationMemberRepository: OrganizationMemberRepository,
    private readonly organizationPublicService: OrganizationPublicService,
    private readonly userPublicService: UserPublicService,
  ) { }

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
      timeUpdate: organization.timeUpdate,
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