import { Controller, Get, Post, Delete, Put, Param, ParseIntPipe, Body } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { IDefaultResponse, IOrganization, IOrganizationCreate, IOrganizationResponse, IOrganizationUser } from '@scspace-depot/types/organization';
import { MOrganizationMember } from './organization.member.model';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) { }

  // HOOK: useOrganization 
  @Get('user/:userId')
  async getOrganizationsByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<IOrganization[]> {
    return await this.organizationService.getOrganizationsByUserId(userId);
  }

  @Get()
  async getOrganizations(): Promise<IOrganization[]> {
    return await this.organizationService.getOrganizations();
  }

  // HOOK: useOrganizationDetail
  @Get(':id')
  async getOrganization(
    @Param('id', ParseIntPipe) organizationId: number,
  ): Promise<IOrganizationResponse> {
    return await this.organizationService.getOrganizationById(organizationId);
  }

  // HOOK: useOrganizationAPI
  @Post()
  async createOrganization(
    @Body() organization: IOrganizationCreate,
  ): Promise<IOrganization> {
    return await this.organizationService.createOrganization(organization);
  }

  @Delete(':id')
  async deleteOrganization(
    @Param('id', ParseIntPipe) organizationId: number
  ): Promise<IDefaultResponse> {
    return await this.organizationService.deleteOrganization(organizationId);
  }

  @Put(':id/add-member/')
  async addMember(
    @Param('id', ParseIntPipe) organizationId: number,
    @Body() oid: IOrganizationUser,
  ): Promise<MOrganizationMember> {
    return await this.organizationService.addMember(organizationId, oid.userId);
  }

  @Put(':id/remove-member/')
  async removeMember(
    @Param('id', ParseIntPipe) organizationId: number,
    @Body() oid: IOrganizationUser,
  ): Promise<IDefaultResponse> {
    return await this.organizationService.removeMember(organizationId, oid.userId);
  }
} 