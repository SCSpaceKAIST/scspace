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
import { MemberGuard, MemberGuardWithRervation, UserGuard } from '../auth/jwt/jwt.guard';
import { IUser } from '@scspace-depot/types/user';
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

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
  @Get('user/:id')
  async getReservationListByUserId(
    @Param('id') userId: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IReservationAll[]> {
    return await this.reservationService.getReservationListByUserId(userId, limit);
  }

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

  // AuthGuard - user
  @UseGuards(MemberGuard)
  @Put()
  async updateReservation(
    @Body() reservationInput: IReservationUpdate,
  ): Promise<IReservation> {
    return await this.reservationService.updateReservation(reservationInput);
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
