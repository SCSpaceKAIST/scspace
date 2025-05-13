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
  IReservationCreateBody,
  IReservationResponse,
  ISpaceTimeCheckRequest,
  IUserTimeCheckRequest,
} from '@scspace-depot/types/reservation';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Get('/space/:spaceId')
  async getReservationBySpaceID(@Param('spaceId') spaceId: string) {
    console.log('getReservationBySpaceID', spaceId);
    const res = await this.reservationService.getReservationBySpaceID(
      parseInt(spaceId),
    );
    console.log('getReservationBySpaceID res', res);
    return res;
  }

  // 예약 시간대가 비었는지 확인하는 GET 요청
  @Get('timeCheck')
  async checkTimeAvailability(
    @Query('spaceId') spaceId: string,
    @Query('timeFrom') timeFrom: string, // ISO 8601 문자열로 받음
    @Query('timeTo') timeTo: string, // ISO 8601 문자열로 받음
  ): Promise<boolean> {
    console.log('checkTimeAvailability', { spaceId, timeFrom, timeTo });
    const query: ISpaceTimeCheckRequest = {
      spaceId: parseInt(spaceId),
      timeFrom: new Date(timeFrom),
      timeTo: new Date(timeTo),
    };
    const res = await this.reservationService.checkTimeAvailability(query);
    console.log('checkTimeAvailability res', res);
    return res;
  }

  // 사용자의 주간 예약 시간 확인하는 GET 요청
  @Get('userCheck')
  async checkUserReservationTime(
    @Query('spaceId') spaceId: string,
    @Query('userId') userId: string,
    @Query('timeFrom') timeFrom: string,
    @Query('timeTo') timeTo: string,
  ): Promise<boolean> {
    console.log('checkUserReservationTime', {
      spaceId,
      userId,
      timeFrom,
      timeTo,
    });
    const query: IUserTimeCheckRequest = {
      spaceId: parseInt(spaceId),
      userId: parseInt(userId),
      timeFrom: new Date(timeFrom),
      timeTo: new Date(timeTo),
    };
    const res = await this.reservationService.checkUserReservationTime(query);
    console.log('checkUserReservationTime res', res);
    return res;
  }

  @Get('manage')
  async getManageReservation(): Promise<IReservationResponse[]> {
    console.log('getManageReservation');
    const res = await this.reservationService.getManageReservation();
    console.log('getManageReservation res', res);
    return res;
  }

  @Get('user/:id')
  async getReservationListByUserId(
    @Param('id') userId: string,
  ): Promise<IReservationResponse[]> {
    console.log('getReservationListByUserId', userId);
    const res = await this.reservationService.getReservationListByUserId(
      parseInt(userId),
    );
    console.log('getReservationListByUserId res', res);
    return res;
  }

  // 예약을 등록하는 POST 요청
  @Post()
  async postReservation(
    @Body() reservationInput: IReservationCreateBody,
  ): Promise<boolean> {
    console.log('postReservation', reservationInput);
    const res = await this.reservationService.postReservation({
      ...reservationInput,
      timeFrom: new Date(reservationInput.timeFrom),
      timeTo: new Date(reservationInput.timeTo),
    });
    console.log('postReservation res', res);
    return res;
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
