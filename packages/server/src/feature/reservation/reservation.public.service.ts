import { Logger, Injectable } from '@nestjs/common';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { ReservationRepository } from './reservation.repository';
import { reservationMaxDayTime } from '@scspace-depot/consts/reservation.const';
import { UserPublicService } from '@scspace-server/feature/user/user.public.service';
import { SpacePublicService } from '@scspace-server/feature/space/space.public.service';
import { reservationMaxWeekTime } from '@scspace-depot/consts/reservation.const';
import { MReservation } from '@scspace-server/feature/reservation/reservation.model';

@Injectable()
export class ReservationPublicService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
  ) {}

  formatDateToSQL(date: Date): string {
    // Date 객체를 SQL DATETIME 형식으로 변환
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  getDifferenceInMinutes(timeFrom: Date, timeTo: Date): number {
    return Math.floor((timeTo.getTime() - timeFrom.getTime()) / (60 * 1000));
  }

  async checkTimeAvailability(
    spaceId: number,
    timeFrom: Date,
    timeTo: Date,
  ): Promise<boolean> {
    const overlappingReservations = await this.reservationRepository.find({
      spaceId: spaceId,
      timeRange: {
        timeFrom: timeFrom,
        timeTo: timeTo,
      },
    });

    return overlappingReservations.length === 0; // 겹치는 예약이 있으면 false
  }

  // 일간 예약 시간을 계산하는 함수
  async getDailyReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: Date,
  ): Promise<number> {
    const today = new Date(timeFrom);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayReservations = await this.reservationRepository.find({
      userId: userId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: today,
        timeTo: tomorrow,
      },
    });

    const totalReservedTime = todayReservations.reduce((acc, reservation) => {
      return (
        acc +
        this.getDifferenceInMinutes(reservation.timeFrom, reservation.timeTo)
      );
    }, 0);
    Logger.log('Daily totalReservedTime', totalReservedTime);
    // 예약된 시간이 없을 경우 0을 반환
    return totalReservedTime / (60 * 1000); // 밀리초를 분으로 변환
  }

  // 주간 예약 시간을 계산하는 함수
  async getWeeklyReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: Date,
  ): Promise<number> {
    const startOfWeek = new Date(timeFrom);
    startOfWeek.setDate(
      startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7),
    ); // 주의 시작일 (월요일)
    startOfWeek.setHours(0, 0, 0, 0); // 시간 초기화

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7); // 주의 끝일 (다음 주 월요일 0시 0분 0초)

    const weeklyReservations = await this.reservationRepository.find({
      userId: userId,
      spaceId: spaceId,
      state: ReservationStateEnum.GRANT,
      timeRange: {
        timeFrom: startOfWeek,
        timeTo: endOfWeek,
      },
    });

    const totalReservedTime = weeklyReservations.reduce((acc, reservation) => {
      return (
        acc +
        this.getDifferenceInMinutes(reservation.timeFrom, reservation.timeTo)
      );
    }, 0);
    Logger.log('Weekly totalReservedTime', totalReservedTime);
    return totalReservedTime; // 밀리초를 분으로 변환
  }

  async checkUserReservationTime(
    userId: number,
    spaceId: number,
    timeFrom: Date,
    timeTo: Date,
  ): Promise<boolean> {
    // 공간위원이면 최대 시간 제한 없음
    if (await this.userPublicService.isManager(userId)) {
      return true;
    }

    const daily = await this.getDailyReservationTime(userId, spaceId, timeFrom);
    const weekly = await this.getWeeklyReservationTime(
      userId,
      spaceId,
      timeFrom,
    );
    const newReservationTime = this.getDifferenceInMinutes(timeFrom, timeTo);
    const space = await this.spacePublicService.fetchSpace(spaceId);
    if (!space) {
      return false;
    }

    const spaceType = space.spaceType;
    Logger.log(
      JSON.stringify({
        daily,
        weekly,
        newReservationTime,
        maxD: reservationMaxDayTime[spaceType],
        maxW: reservationMaxWeekTime[spaceType],
      }),
    );
    Logger.log(daily + newReservationTime <= reservationMaxDayTime[spaceType]);
    Logger.log(
      weekly + newReservationTime <= reservationMaxWeekTime[spaceType],
    );
    return (
      daily + newReservationTime <= reservationMaxDayTime[spaceType] &&
      weekly + newReservationTime <= reservationMaxWeekTime[spaceType]
    );
  }

  async checkReservationAvailability(
    userId: number,
    spaceId: number,
    timeFrom: Date,
    timeTo: Date,
  ): Promise<boolean> {
    return (
      (await this.checkTimeAvailability(spaceId, timeFrom, timeTo)) &&
      (await this.checkUserReservationTime(userId, spaceId, timeFrom, timeTo))
    );
  }

  async find(params: {
    userId?: number;
    spaceIds?: number[];
    timeRange?: { timeFrom: Date; timeTo: Date };
  }): Promise<MReservation[]> {
    return this.reservationRepository.find(params);
  }
}
