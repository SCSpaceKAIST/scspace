import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './reservation.repository';
import { DBModule } from 'src/db/db.module';
import { ReservationController } from './reservation.controller';
import { SpaceModule } from 'src/feature/space/space.module';
import { UserModule } from 'src/feature/user/user.module';
import { ReservationPublicService } from './reservation.public.service';
import { OrganizationModule } from 'src/feature/organization/organization.module';

@Module({
  imports: [DBModule, SpaceModule, UserModule, OrganizationModule],
  controllers: [ReservationController],
  providers: [
    ReservationRepository,
    ReservationPublicService,
    ReservationService,
  ],
  exports: [ReservationPublicService],
})
export class ReservationModule {}
