import { Controller, Get, Post, Delete, Put, Param, ParseIntPipe, Body } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { IOrganization, IOrganizationAll, IOrganizationCreate, IOrganizationDelegator, IOrganizationMember, IOrganizationUpdate, IOrganizationUser } from '@scspace-depot/types/organization';
import { MOrganizationMember } from './organization.member.model';
import { ISuccessResponse } from '@scspace-depot/types/common';
import { OrganizationPublicService } from './organization.public.service';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly organizationPublicService: OrganizationPublicService,
  ) { }

  // HOOK: useAllOrganization
  @Get()
  async getOrganizations(): Promise<IOrganizationDelegator[]> {
    return await this.organizationService.getAll();
  }

  // HOOK: useOrganization 
  @Get('user/:id')
  async getOrganizationsByUserId(@Param('id', ParseIntPipe) id: number): Promise<IOrganizationDelegator[]> {
    return await this.organizationPublicService.fetchByUserId(id);
  }

  // HOOK: useOrganizationDetail
  @Get(':id')
  async getOrganizationById(
    @Param('id', ParseIntPipe) organizationId: number,
  ): Promise<IOrganizationAll> {
    return await this.organizationService.getDeepById(organizationId);
  }

  // HOOK: useOrganizationAPI
  @Post()
  async createOrganization(
    @Body() organization: IOrganizationCreate,
  ): Promise<IOrganization> {
    return await this.organizationService.insert(organization);
  }

  @Put(':id')
  async updateOrganization(
    @Param('id', ParseIntPipe) organizationId: number,
    @Body() organizationNew: IOrganizationUpdate,
  ): Promise<IOrganization> {
    return await this.organizationService.update(organizationId, organizationNew);
  }

  @Put(':id/add/')
  async addMember(
    @Param('id', ParseIntPipe) organizationId: number,
    @Body() oid: IOrganizationUser,
  ): Promise<MOrganizationMember> {
    return await this.organizationService.insertMember(organizationId, oid.userId);
  }

  @Put(':id/delete/')
  async removeMember(
    @Param('id', ParseIntPipe) organizationId: number,
    @Body() oid: IOrganizationUser,
  ): Promise<ISuccessResponse> {
    return await this.organizationService.deleteMember(organizationId, oid.userId);
  }

  @Delete(':id')
  async deleteOrganization(
    @Param('id', ParseIntPipe) organizationId: number
  ): Promise<ISuccessResponse> {
    return await this.organizationService.delete(organizationId);
  }
} 