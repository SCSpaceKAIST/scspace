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
  IReservationResponse,
  IReservationCreate,
  ISpaceTimeCheckRequest,
  IUserTimeCheckRequest
} from '@scspace-depot/types/reservation';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('space')
  async getReservationBySpaceID(
    @Query('spaceId', ParseIntPipe) spaceId: number,
    @Query('timeFrom') timeFrom?: string,
    @Query('timeTo') timeTo?: string
  ): Promise<IReservationResponse[]> {
    return await this.reservationService.getReservationBySpaceIDBetweenTime(
      spaceId,
      timeFrom,
      timeTo,
    );
  }

  // 예약 시간대가 비었는지 확인하는 GET 요청
  @Get('timeCheck')
  async checkTimeAvailability(
    @Query('spaceId', ParseIntPipe) spaceId: number,
    @Query('timeFrom') timeFrom: string,
    @Query('timeTo') timeTo: string,
  ): Promise<boolean> {
    const query: ISpaceTimeCheckRequest = {
      spaceId: spaceId,
      organizationId: 0, // TODO: Get from context
      timeFrom: new Date(timeFrom).toISOString(),
      timeTo: new Date(timeTo).toISOString(),
    };
    return await this.reservationService.checkTimeAvailability(query);
  }

  // 사용자의 주간 예약 시간 확인하는 GET 요청
  @Get('userCheck')
  async checkUserReservationTime(
    @Query('spaceId', ParseIntPipe) spaceId: number,
    @Query('userId', ParseIntPipe) userId: number,
    @Query('timeFrom') timeFrom: string,
    @Query('timeTo') timeTo: string,
  ): Promise<boolean> {
    const query: IUserTimeCheckRequest = {
      spaceId: spaceId,
      userId: userId,
      organizationId: 0, // TODO: Get from context
      timeFrom: new Date(timeFrom).toISOString(),
      timeTo: new Date(timeTo).toISOString(),
    };
    return await this.reservationService.checkUserReservationTime(query);
  }

  @Get('manage')
  async getManageReservation(): Promise<IReservationResponse[]> {
    return await this.reservationService.getManageReservation();
  }

  @Get('user/:id')
  async getReservationListByUserId(
    @Param('id') userId: number,
  ): Promise<IReservationResponse[]> {
    return await this.reservationService.getReservationListByUserId(userId);
  }

  // 예약을 등록하는 POST 요청
  @Post()
  async postReservation(
    @Body() reservationInput: IReservationCreate,
  ): Promise<IReservation> {
    return await this.reservationService.postReservation(reservationInput);
  }

  @Put()
  async updateReservation(
    @Body() reservationInput: IReservation,
  ): Promise<boolean> {
    Logger.log('Update Reservation: ' + JSON.stringify(reservationInput));
    try {
      const result =
        await this.reservationService.updateReservation(reservationInput);
      return result;
    } catch (error) {
      throw new BadRequestException('Error updating reservation.');
    }
  }

  @Delete(':id')
  async deleteReservation(@Param('id') id: number): Promise<boolean> {
    return await this.reservationService.deleteReservation(id);
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
