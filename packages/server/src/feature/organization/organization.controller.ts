import { Controller, Get, Post, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { IOrganization } from '@scspace-depot/types/organization';
import { MOrganizationMember } from './organization.member.model';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
  @Post()
  async createOrganization(
    @Body() organization: IOrganization,
  ): Promise<IOrganization> {
    return await this.organizationService.createOrganization(organization);
  }

  @Get('organizations')
  async getOrganizations(): Promise<IOrganization[]> {
    return await this.organizationService.getOrganizations();
  }

  @Get('user/:userId')
  async getOrganizationsByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<IOrganization[]> {
    return await this.organizationService.getOrganizationsByUserId(userId);
  }

  @Get(':id/members')
  async getOrganizationMembers(
    @Param('id', ParseIntPipe) organizationId: number,
  ): Promise<MOrganizationMember[]> {
    return await this.organizationService.getOrganizationMembers(organizationId);
  }

  @Post(':id/add-member/:userId')
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
  ): Promise<void> {
    await this.organizationService.removeMember(organizationId, userId);
  }
} 