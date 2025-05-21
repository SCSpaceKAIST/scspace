import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Put,
  ParseIntPipe,
  Delete
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {
  IReservation,
  IReservationCreate,
  ISpaceTimeCheckRequest,
  IUserTimeCheckRequest,
  IReservationUpdate,
  IReservationAll
} from '@scspace-depot/types/reservation';
import { ISuccessResponse } from '@scspace-depot/types/common';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  //HOOK: useReservations
  @Get('space')
  async getReservationBySpaceID(
    @Query('spaceId', ParseIntPipe) spaceId: number,
    @Query('timeFrom') timeFrom?: string,
    @Query('timeTo') timeTo?: string
  ): Promise<IReservationAll[]> {
    return await this.reservationService.getReservationBySpaceIDBetweenTime(
      spaceId,
      timeFrom,
      timeTo,
    );
  }

  @Get('user/:id')
  async getReservationListByUserId(
    @Param('id') userId: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IReservationAll[]> {
    return await this.reservationService.getReservationListByUserId(userId, limit);
  }

  @Get('manage')
  async getManageReservation(): Promise<IReservationAll[]> {
    return await this.reservationService.getManageReservation();
  }

  @Post()
  async postReservation(
    @Body() reservationInput: IReservationCreate,
  ): Promise<IReservation> {
    return await this.reservationService.postReservation(reservationInput);
  }

  @Put()
  async updateReservation(
    @Body() reservationInput: IReservationUpdate,
  ): Promise<IReservation> {
    return await this.reservationService.updateReservation(reservationInput);
  }

  @Delete(':id')
  async deleteReservation(@Param('id') id: number): Promise<ISuccessResponse> {
    return await this.reservationService.deleteReservation(id);
  }
}
