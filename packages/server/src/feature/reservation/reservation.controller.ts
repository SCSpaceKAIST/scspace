import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  BadRequestException,
  Logger,
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
import { formatDateToSQL } from '@scspace-server/common/util';
import { ISuccessResponse } from '@scspace-depot/types/common';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

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
    try {
      const result =
        await this.reservationService.updateReservation(reservationInput);
      return result;
    } catch (error) {
      throw new BadRequestException('Error updating reservation.');
    }
  }

  @Delete(':id')
  async deleteReservation(@Param('id') id: number): Promise<ISuccessResponse> {
    return await this.reservationService.deleteReservation(id);
  }

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
  ): Promise<IReservationAll[]> {
    return await this.reservationService.getReservationListByUserId(userId);
  }

  @Get('manage')
  async getManageReservation(): Promise<IReservationAll[]> {
    return await this.reservationService.getManageReservation();
  }

  @Post('check/space')
  async checkSpaceTime(@Body() query: ISpaceTimeCheckRequest): Promise<boolean> {
    return await this.reservationService.checkTimeAvailability(query);
  }

  @Post('check/user')
  async checkUserTime(@Body() query: IUserTimeCheckRequest): Promise<boolean> {
    return await this.reservationService.checkUserReservationTime(query);
  }
}
