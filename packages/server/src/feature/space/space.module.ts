import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceRepository } from './space.repository';
import { SpacePublicService } from './space.public.service';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [SpaceController],
  providers: [SpaceRepository, SpacePublicService],
  exports: [SpacePublicService],
})
export class SpaceModule {}
