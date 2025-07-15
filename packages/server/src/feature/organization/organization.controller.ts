import { Controller, Get, Post, Delete, Put, Param, ParseIntPipe, Body, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { IOrganization, IOrganizationAll, IOrganizationCreate, IOrganizationDelegator, IOrganizationMember, IOrganizationUpdate, IOrganizationUser } from '@scspace-depot/types/organization';
import { MOrganizationMember } from './organization.member.model';
import { ISuccessResponse } from '@scspace-depot/types/common';
import { OrganizationPublicService } from './organization.public.service';
import { ManageGuard, UserGuard, MemberGuard, DelegatorGuard } from '../auth/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly organizationPublicService: OrganizationPublicService,
  ) { }

  // HOOK: useAllOrganization
  @UseGuards(ManageGuard)
  @Get()
  async getOrganizations(): Promise<IOrganizationDelegator[]> {
    return await this.organizationPublicService.fetchAll();
  }

  // HOOK: useOrganization 
  @UseGuards(UserGuard)
  @Get('user/:id')
  async getOrganizationsByUserId(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IOrganizationDelegator[]> {
    const result = await this.organizationPublicService.fetchByUserId(id);
    return result.filter(org => org.id !== 1);
  }

  // HOOK: useOrganizationDetail
  @UseGuards(MemberGuard)
  @Get(':id')
  async getOrganizationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IOrganizationAll> {
    return await this.organizationPublicService.fetchDeepById(id);
  }

  // HOOK: useOrganizationAPI

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrganization(
    @Body() organization: IOrganizationCreate,
  ): Promise<IOrganization> {
    return await this.organizationService.insert(organization);
  }

  @UseGuards(DelegatorGuard)
  @Put(':id')
  async updateOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body() organizationNew: IOrganizationUpdate,
  ): Promise<IOrganization> {
    return await this.organizationService.update(id, organizationNew);
  }

  @UseGuards(DelegatorGuard)
  @Post('member/:id')
  async addMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() oid: IOrganizationUser,
  ): Promise<MOrganizationMember> {
    return await this.organizationPublicService.insertMember(id, oid.userId);
  }

  @UseGuards(DelegatorGuard)
  @Delete('/member/:id')
  async removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() oid: IOrganizationUser,
  ): Promise<ISuccessResponse> {
    return await this.organizationService.deleteMember(id, oid.userId);
  }

  @UseGuards(DelegatorGuard)
  @Delete(':id')
  async deleteOrganization(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ISuccessResponse> {
    return await this.organizationService.delete(id);
  }
} 