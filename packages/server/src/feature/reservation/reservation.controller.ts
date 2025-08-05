import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Put,
  ParseIntPipe,
  Delete,
  UseGuards,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { ReservationService } from './reservation.service';
import {
  IReservation,
  IReservationCreate,
  IReservationUpdate,
  IReservationAll,
  IReservationCreateMultiple,
  IReservationMultipleCreateResurt
} from '@scspace-depot/src/types/reservation';
import { IDataResponse, ISuccessResponse } from '@scspace-depot/src/types/common';
import { AdminGuard, ManagerGuard, MemberGuard, MemberGuardWithRervation, UserGuard } from '../auth/jwt/jwt.guard';
import { IUser } from '@scspace-depot/src/types/user';
import { SpacePublicService } from '../space/space.public.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService,
    private readonly spaceService: SpacePublicService,
  ) { }

  //HOOK: useReservations
  //HOOK: useDateReservations
  @Get('space')
  async getReservationBySpaceID(
    @Query('spaceId', ParseIntPipe) spaceId: number,
    @Query('timeFrom') timeFrom?: number,
    @Query('timeTo') timeTo?: number
  ): Promise<IReservationAll[]> {
    return await this.reservationService.getReservationBySpaceIDBetweenTime(
      spaceId,
      timeFrom,
      timeTo,
    );
  }

  // AuthGuard - user
  //HOOK: useUserReservation
  @UseGuards(UserGuard)
  @Get('user')
  async getReservationListByUserId(
    @Query('uid', ParseIntPipe) userId: number,
    @Query('oid', ParseIntPipe) organizationId: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<IDataResponse<IReservationAll[]>> {
    return await this.reservationService.getReservationListByUserId(
      userId,
      organizationId,
      limit,
      offset,
    )
  };

  @UseGuards(ManagerGuard)
  @Get()
  async getReservationList(
    @Query('oid', ParseIntPipe) organizationId: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<IDataResponse<IReservationAll[]>> {
    return await this.reservationService.getReservationList(
      organizationId,
      limit,
      offset,
    )
  };

  // @UseGuards(UserGuard)
  // @Get('count')
  // async getReservationCount(
  //   @Query('oid', ParseIntPipe) organizationId: number,
  //   @Query('uid') userId?: number,
  // ): Promise<{ count: number }> {
  //   return await this.reservationService.getReservationCount({
  //     organizationId,
  //     userId,
  //   });
  // }

  //HOOK: useWaitReservations
  // @Get('manage')
  // async getManageReservation(): Promise<IReservationAll[]> {
  //   return await this.reservationService.getManageReservation();
  // }

  // AuthGuard - jwt
  //HOOK: useReservationAPI
  @UseGuards(MemberGuard)
  @Post()
  async postReservation(
    @Body() reservationInput: IReservationCreate,
  ): Promise<IReservation> {
    return await this.reservationService.postReservation(reservationInput);
  }

  @UseGuards(ManagerGuard)
  @Post('multiple')
  async postMultipleReservation(
    @Body() reservationInput: IReservationCreateMultiple,
  ): Promise<IReservationMultipleCreateResurt> {
    return await this.reservationService.postMultipleReservation(reservationInput);
  }

  // AuthGuard - user
  @UseGuards(MemberGuard)
  @Put()
  async updateReservation(
    @Body() reservationInput: IReservationUpdate,
  ): Promise<IReservation> {
    return await this.reservationService.updateReservation(reservationInput);
  }

  @UseGuards(AdminGuard)
  @Delete('all')
  async deleteAllReservation(): Promise<ISuccessResponse> {
    const spaces = await this.spaceService.fetchAll();
    for (const space of spaces) {
      const reservations = await this.reservationService.getReservationBySpaceIDBetweenTime(space.id);
      for (const reservation of reservations) {
        await this.reservationService.deleteReservation(reservation.id, reservation.user);
      }
    }
    return {
      success: true,
    };
  }

  // AuthGuard - user
  @UseGuards(MemberGuardWithRervation)
  @Delete(':id')
  // 1인 경우를 고려하기 위해 추가
  // userid 비교 
  async deleteReservation(@Param('id') id: number, @Req() req: Request): Promise<ISuccessResponse> {
    return await this.reservationService.deleteReservation(id, (req as any).user as IUser);
  }
}
