import { Controller, Get, Param } from '@nestjs/common';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Get('/space/:space_id')
  async getReservationBySpaceID(@Param('space_id') space_id: number) {
    return await this.reservationService.getReservationBySpaceID(space_id);
  }
}
