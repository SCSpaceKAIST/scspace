import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { DBModule } from 'src/db/db.module';
import { SpaceRepository } from './space.repository';

@Module({
  imports: [DBModule],
  providers: [SpaceService, SpaceRepository],
  controllers: [SpaceController],
})
export class SpaceModule {}
