import {
  IReservationResponse,
  ISpaceTimeCheckRequest,
  IUserTimeCheckRequest,
  IReservationCreate,
  IReservationUpdate,
} from '@scspace-depot/types/reservation';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { checkContainAllId, takeAll, takeOne } from 'src/common/util';
import { UserPublicService } from '../user/user.public.service';
import { SpacePublicService } from '../space/space.public.service';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { MUser } from '../user/user.model';
import { ReservationPublicService } from './reservation.public.service';
import { IUser } from '@scspace-depot/types/user';
import { ISpace } from '@scspace-depot/types/space';
@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationPublicService: ReservationPublicService,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
  ) {}

  async getReservationBySpaceID(
    spaceId: number,
  ): Promise<IReservationResponse[]> {
    const reservations = await this.reservationRepository.find({ spaceId });
    const userIds = reservations.map((reservation) => reservation.userId);
    const [users, space] = await Promise.all([
      this.userPublicService.fetchAll(userIds).then(takeAll(userIds, 'users')),
      this.spacePublicService.fetchSpace(spaceId),
    ]);

    checkContainAllId(userIds, users, 'users');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find((user) => user.id === reservation.userId) as MUser, // 위에서 checkContainAllId 로 체크했기 때문에 무조건 있음
      space: space,
    }));
  }

  async checkTimeAvailability(query: ISpaceTimeCheckRequest): Promise<boolean> {
    return await this.reservationPublicService.checkTimeAvailability(
      query.spaceId,
      query.timeFrom,
      query.timeTo,
    );
  }

  async checkUserReservationTime(
    query: IUserTimeCheckRequest,
  ): Promise<boolean> {
    return await this.reservationPublicService.checkUserReservationTime(
      query.userId,
      query.spaceId,
      query.timeFrom,
      query.timeTo,
    );
  }

  async postReservation(
    reservationInput: IReservationCreate,
  ): Promise<boolean> {
    const space = await this.spacePublicService.fetchSpace(
      reservationInput.spaceId,
    );

    // 예약 가능한 시간인지 확인하기
    const isAvailable =
      await this.reservationPublicService.checkReservationAvailability(
        reservationInput.userId,
        reservationInput.spaceId,
        reservationInput.timeFrom,
        reservationInput.timeTo,
      );
    Logger.log('isAvailable', isAvailable);
    if (isAvailable) {
      return await this.reservationRepository.insert(
        reservationInput,
        space.spaceType,
      );
    }
    throw new BadRequestException('time is not available');
  }

  async updateReservation(
    reservationInput: IReservationUpdate,
  ): Promise<boolean> {
    const reservation = await this.reservationRepository
      .find({
        id: reservationInput.id,
      })
      .then(takeOne('reservation'));

    // 만약 상태를 바꾸는 경우, 시간이 가능한 지 체크
    if (
      reservation.state !== ReservationStateEnum.GRANT &&
      reservationInput.state === ReservationStateEnum.GRANT
    ) {
      const isAvailable =
        await this.reservationPublicService.checkReservationAvailability(
          reservation.userId,
          reservation.spaceId,
          reservation.timeFrom,
          reservation.timeTo,
        );

      if (!isAvailable) {
        throw new BadRequestException('time is not available');
      }
    }

    const newReservation = {
      ...reservation,
      ...reservationInput,
    };

    return await this.reservationRepository.updateReservation(newReservation);
  }

  async getManageReservation(): Promise<IReservationResponse[]> {
    const reservations = await this.reservationRepository.find({
      states: [ReservationStateEnum.RECEIVED, ReservationStateEnum.WAIT],
    });

    const userIds = reservations.map((reservation) => reservation.userId);
    const spaceIds = reservations.map((reservation) => reservation.spaceId);
    const [users, spaces] = await Promise.all([
      this.userPublicService.fetchAll(userIds).then(takeAll(userIds, 'users')),
      this.spacePublicService.fetchSpaceAll(spaceIds),
    ]);

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(spaceIds, spaces, 'spaces');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find((user) => user.id === reservation.userId) as IUser,
      space: spaces.find((space) => space.id === reservation.spaceId) as ISpace,
    }));
  }

  async getReservationListByUserId(
    userId: number,
  ): Promise<IReservationResponse[]> {
    const reservations = await this.reservationRepository.find({
      userId,
    });

    const userIds = reservations.map((reservation) => reservation.userId);
    const spaceIds = reservations.map((reservation) => reservation.spaceId);
    const [users, spaces] = await Promise.all([
      this.userPublicService.fetchAll(userIds).then(takeAll(userIds, 'users')),
      this.spacePublicService.fetchSpaceAll(spaceIds),
    ]);

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(spaceIds, spaces, 'spaces');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find((user) => user.id === reservation.userId) as IUser,
      space: spaces.find((space) => space.id === reservation.spaceId) as ISpace,
    }));
  }
}
