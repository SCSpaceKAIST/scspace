import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { IOrganization, IOrganizationDelegator } from '@scspace-depot/types/organization';
import { UserPublicService } from '../user/user.public.service';
import { MOrganization } from './organization.model';

@Injectable()
export class OrganizationPublicService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly userPublicService: UserPublicService,
  ) {}

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

  async fetchById(id: number): Promise<IOrganization> {
    const organization = await this.organizationRepository.fetch({ id: id });
    if (organization.length === 0) {
      throw new NotFoundException('Organization not found');
    }
    return MOrganization.fromDB(organization[0]);
  }

  async fetchAll(): Promise<IOrganization[]> {
    const organizations = await this.organizationRepository.fetchAll();
    if (organizations.length === 0) {
      return [];
    }
    return organizations.map(MOrganization.fromDB);
  }

  async count(): Promise<number> {
    return (await this.organizationRepository.fetchAll()).length;
  }
} 
