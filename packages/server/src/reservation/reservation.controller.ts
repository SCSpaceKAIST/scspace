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
  ReservationInputType,
  ReservationOutputType,
  ReservationType,
  SpaceTimeCheckInputType,
  UserTimeCheckInputType,
} from '@depot/types/reservation';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Get('/space/:space_id')
  async getReservationBySpaceID(@Param('space_id') space_id: number) {
    return await this.reservationService.getReservationBySpaceID(space_id);
  }

  // 예약 시간대가 비었는지 확인하는 GET 요청
  @Get('timeCheck')
  async checkTimeAvailability(
    @Query('space_id') spaceId: number,
    @Query('time_from') timeFrom: string, // ISO 8601 문자열로 받음
    @Query('time_to') timeTo: string, // ISO 8601 문자열로 받음
  ): Promise<boolean> {
    const query: SpaceTimeCheckInputType = {
      space_id: spaceId,
      time_from: timeFrom,
      time_to: timeTo,
    };

    try {
      const isAvailable =
        await this.reservationService.checkTimeAvailability(query);
      return isAvailable;
    } catch (error) {
      throw new BadRequestException('Error checking time availability.');
    }
  }

  // 사용자의 주간 예약 시간 확인하는 GET 요청
  @Get('userCheck')
  async checkUserReservationTime(
    @Query('space_id') spaceId: number,
    @Query('user_id') userId: string,
    @Query('time_from') timeFrom: string, // ISO 8601 문자열로 받음
    @Query('time_to') timeTo: string,
  ): Promise<boolean> {
    const query: UserTimeCheckInputType = {
      space_id: spaceId,
      user_id: userId,
      time_from: timeFrom,
      time_to: timeTo,
    };
    Logger.log(JSON.stringify(query));

    try {
      const isValidUserReservation =
        await this.reservationService.checkUserReservationTime(query);
      return isValidUserReservation;
    } catch (error) {
      throw new BadRequestException('Error checking user reservation time.');
    }
  }

  @Get('manage')
  async getManageReservation(): Promise<ReservationOutputType[] | false> {
    return await this.reservationService.getManageReservation();
  }

  @Get('user/:id')
  async getReservationListByUserId(
    @Param('id') userid: string,
  ): Promise<ReservationOutputType[] | false> {
    return this.reservationService.getReservationListByUserId(userid);
  }

  // 예약을 등록하는 POST 요청
  @Post()
  async createReservation(
    @Body() reservationInput: ReservationInputType,
  ): Promise<boolean> {
    Logger.log('Create Reservation: ' + JSON.stringify(reservationInput));
    try {
      const result =
        await this.reservationService.createReservation(reservationInput);
      return result;
    } catch (error) {
      throw new BadRequestException('Error creating reservation.');
    }
  }

  @Put()
  async updateReservation(
    @Body() reservationInput: ReservationType,
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
