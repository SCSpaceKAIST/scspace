import {
  ReservationType,
  SpaceTimeCheckInputType,
  UserTimeCheckInputType,
  reservationMaxDayTime,
  reservationMaxWeekTime,
} from '@depot/types/reservation';
import { Injectable, Logger } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { SpaceRepository } from 'src/space/space.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async getReservationAll(): Promise<ReservationType[] | false> {
    return await this.reservationRepository.getReservationAll();
  }

  async getReservationBySpaceID(
    space_id: number,
  ): Promise<ReservationType[] | false> {
    return await this.reservationRepository.getReservationBySpaceID(space_id);
  }

  async checkTimeAvailability(
    query: SpaceTimeCheckInputType,
  ): Promise<boolean> {
    return await this.reservationRepository.checkTimeOverlap(
      query.space_id,
      query.time_from,
      query.time_to,
    );
  }

  async checkUserReservationTime(
    query: UserTimeCheckInputType,
  ): Promise<boolean> {
    const getDifferenceInMinutes = (dateFrom: Date, dateTo: Date): number => {
      const diffInMs = dateTo.getTime() - dateFrom.getTime(); // 밀리초 단위의 차이 계산
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // 밀리초를 분으로 변환
      return diffInMinutes;
    };

    const daily = await this.reservationRepository.getDailyReservationTime(
      query.user_id,
      query.space_id,
      query.time_from,
    );
    const weekly = await this.reservationRepository.getWeeklyReservationTime(
      query.user_id,
      query.space_id,
      query.time_from,
    );
    const newReservationTime = getDifferenceInMinutes(
      query.time_from,
      query.time_to,
    );
    const space = await this.spaceRepository.getSpaceById(query.space_id);
    if (!space) {
      return false;
    }
    const spaceType = space.space_type;
    Logger.log(
      JSON.stringify({
        daily,
        weekly,
        newReservationTime,
        maxD: reservationMaxDayTime[spaceType],
        maxW: reservationMaxWeekTime[spaceType],
      }),
    );
    return (
      daily + newReservationTime <= reservationMaxDayTime[spaceType] &&
      weekly + newReservationTime <= reservationMaxWeekTime[spaceType]
    );
  }
}
