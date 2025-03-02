import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { DBModule } from 'src/db/db.module';
import { TeamRepository } from './team.repository';
import { SemesterModule } from '../semester/semester.module';
import { UserModule } from '../user/user.module';
import { TeamMemberRepository } from './team.member.repository';

@Module({
  imports: [DBModule, SemesterModule, UserModule],
  providers: [TeamService, TeamRepository, TeamMemberRepository],
  controllers: [TeamController],
})
export class TeamModule {}
