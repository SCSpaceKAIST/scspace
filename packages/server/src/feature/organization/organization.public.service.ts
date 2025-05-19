import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { IOrganization } from '@scspace-depot/types/organization';

@Injectable()
export class OrganizationPublicService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async fetchByUserId(id: number): Promise<IOrganization> {
    const organizations = await this.organizationRepository.fetch(id);
    return organizations[0];
  }

  async fetchByOrganizationIds(ids: number[]): Promise<IOrganization[]> {
    return await this.organizationRepository.fetch(ids);
  }

  async fetchAll(): Promise<IOrganization[]> {
    return await this.organizationRepository.fetchAll();
  }
} 
