import { Controller, Get, Post, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { IOrganization, IOrganizationCreate, IOrganizationResponse } from '@scspace-depot/types/organization';
import { MOrganizationMember } from './organization.member.model';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
  @Post()
  async createOrganization(
    @Body() organization: IOrganizationCreate,
  ): Promise<IOrganization> {
    return await this.organizationService.createOrganization(organization);
  }

  @Get()
  async getOrganizations(): Promise<IOrganization[]> {
    return await this.organizationService.getOrganizations();
  }

  @Delete(':id')
  async deleteOrganization(@Param('id', ParseIntPipe) organizationId: number): Promise<void> {
    return await this.organizationService.deleteOrganization(organizationId);
  }

  @Get('user/:userId')
  async getOrganizationsByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<IOrganization[]> {
    return await this.organizationService.getOrganizationsByUserId(userId);
  }

  @Get(':id')
  async getOrganization(
    @Param('id', ParseIntPipe) organizationId: number,
  ): Promise<IOrganizationResponse> {
    return await this.organizationService.getOrganizationById(organizationId);
  }

  @Get(':id/add-member/:userId')
  async addMember(
    @Param('id', ParseIntPipe) organizationId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<MOrganizationMember> {
    return await this.organizationService.addMember(organizationId, userId);
  }

  @Delete(':id/remove-member/:userId')
  async removeMember(
    @Param('id', ParseIntPipe) organizationId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<boolean> {
    return await this.organizationService.removeMember(organizationId, userId);
  }
} 