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
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {
  IReservation,
  IReservationCreate,
  IReservationResponse,
  ISpaceTimeCheckRequest,
  IUserTimeCheckRequest,
} from '@scspace-depot/types/reservation';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Get('/space/:spaceId')
  async getReservationBySpaceID(@Param('spaceId') spaceId: string) {
    return await this.reservationService.getReservationBySpaceID(
      parseInt(spaceId),
    );
  }

  // 예약 시간대가 비었는지 확인하는 GET 요청
  @Get('timeCheck')
  async checkTimeAvailability(
    @Query('spaceId') spaceId: string,
    @Query('timeFrom') timeFrom: string, // ISO 8601 문자열로 받음
    @Query('timeTo') timeTo: string, // ISO 8601 문자열로 받음
  ): Promise<boolean> {
    const query: ISpaceTimeCheckRequest = {
      spaceId: parseInt(spaceId),
      timeFrom: new Date(timeFrom),
      timeTo: new Date(timeTo),
    };

    return await this.reservationService.checkTimeAvailability(query);
  }

  // 사용자의 주간 예약 시간 확인하는 GET 요청
  @Get('userCheck')
  async checkUserReservationTime(
    @Query('spaceId') spaceId: string,
    @Query('userId') userId: string,
    @Query('timeFrom') timeFrom: string, // ISO 8601 문자열로 받음
    @Query('timeTo') timeTo: string,
  ): Promise<boolean> {
    const query: IUserTimeCheckRequest = {
      spaceId: parseInt(spaceId),
      userId: parseInt(userId),
      timeFrom: new Date(timeFrom),
      timeTo: new Date(timeTo),
    };

    return await this.reservationService.checkUserReservationTime(query);
  }

  @Get('manage')
  async getManageReservation(): Promise<IReservationResponse[]> {
    return await this.reservationService.getManageReservation();
  }

  @Get('user/:id')
  async getReservationListByUserId(
    @Param('id') userId: string,
  ): Promise<IReservationResponse[]> {
    return this.reservationService.getReservationListByUserId(parseInt(userId));
  }

  // 예약을 등록하는 POST 요청
  @Post()
  async postReservation(
    @Body() reservationInput: IReservationCreate,
  ): Promise<boolean> {
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
}
