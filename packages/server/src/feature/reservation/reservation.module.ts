import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './reservation.repository';
import { DBModule } from 'src/db/db.module';
import { ReservationController } from './reservation.controller';
import { SpaceModule } from 'src/feature/space/space.module';
import { UserModule } from 'src/feature/user/user.module';

@Module({
  imports: [DBModule, SpaceModule, UserModule],
  providers: [ReservationService, ReservationRepository],
  controllers: [ReservationController],
})
export class ReservationModule {}
