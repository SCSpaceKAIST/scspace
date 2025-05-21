import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { OrganizationRepository } from './organization.repository';
import { OrganizationMemberRepository } from './organization.member.repository';
import { OrganizationPublicService } from './organization.public.service';
import { DBModule } from '@scspace-server/db/db.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DBModule, UserModule],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationRepository,
    OrganizationMemberRepository,
    OrganizationPublicService,
  ],
  exports: [OrganizationService, OrganizationPublicService],
})
export class OrganizationModule {} 