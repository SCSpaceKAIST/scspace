import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { DBModule } from 'src/db/db.module';
import { SpaceRepository } from './space.repository';
import { SpacePublicService } from './space.public.service';

@Module({
  imports: [DBModule],
  providers: [SpaceService, SpaceRepository, SpacePublicService],
  controllers: [SpaceController],
  exports: [SpacePublicService],
})
export class SpaceModule {}
