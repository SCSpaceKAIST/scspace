import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './reservation.repository';
import { DBModule } from 'src/db/db.module';
import { ReservationController } from './reservation.controller';
import { SpaceModule } from 'src/space/space.module';

@Module({
  imports: [DBModule, SpaceModule],
  providers: [ReservationService, ReservationRepository],
  controllers: [ReservationController],
})
export class ReservationModule {}
