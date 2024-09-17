import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { DBModule } from 'src/db/db.module';
import { TeamRepository } from './team.repository';

@Module({
  imports: [DBModule],
  providers: [TeamService, TeamRepository],
  controllers: [TeamController],
})
export class TeamModule {}
