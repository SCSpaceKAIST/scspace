import {
  IReservationResponse,
  ISpaceTimeCheckRequest,
  IUserTimeCheckRequest,
  IReservationCreate,
  IReservationUpdate,
} from '@scspace-depot/types/reservation';
import { IOrganization } from '@scspace-depot/types/organization';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { checkContainAllId, takeAll, takeOne } from 'src/common/util';
import { UserPublicService } from '../user/user.public.service';
import { SpacePublicService } from '../space/space.public.service';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { ReservationPublicService } from './reservation.public.service';
import { IUser } from '@scspace-depot/types/user';
import { ISpace } from '@scspace-depot/types/space';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
import { reservationMaxDayTime, reservationMaxWeekTime } from '@scspace-depot/consts/reservation.const';
import { OrganizationPublicService } from '../organization/organization.public.service';
import { MReservation } from './reservation.model';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationPublicService: ReservationPublicService,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
    private readonly organizationPublicService: OrganizationPublicService,
  ) {}

  private getWeekRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Saturday
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  private calculateDurationInMinutes(from: Date, to: Date): number {
    return Math.floor((to.getTime() - from.getTime()) / (1000 * 60));
  }

  private async validateTimeConstraints(
    userId: number,
    spaceId: number,
    timeFrom: string,
    timeTo: string,
    excludeReservationId?: number,
  ): Promise<void> {
    // 1. Get space type
    const space = await this.spacePublicService.fetchById(spaceId);
    
    // 2. Check daily time limit
    const duration = this.calculateDurationInMinutes(new Date(timeFrom), new Date(timeTo));
    const maxDayTime = reservationMaxDayTime[space.spaceType];
    
    if (duration > maxDayTime) {
      throw new BadRequestException(
        `Reservation duration exceeds daily limit of ${maxDayTime} minutes for ${space.spaceType}`,
      );
    }

    // 3. Check weekly time limit
    const weekRange = this.getWeekRange(new Date(timeFrom));
    const weekReservations = await this.reservationRepository.find({
      userId,
      spaceId,
      timeRange: {
        timeFrom: weekRange.start.toISOString(),
        timeTo: weekRange.end.toISOString(),
      },
    });

    const totalWeekMinutes = weekReservations.reduce(
      (total, reservation) =>
        total + this.calculateDurationInMinutes(new Date(reservation.timeFrom), new Date(reservation.timeTo)),
      duration, // Include the current reservation duration
    );

    const maxWeekTime = reservationMaxWeekTime[space.spaceType];
    if (totalWeekMinutes > maxWeekTime) {
      throw new BadRequestException(
        `Total weekly reservation time would exceed limit of ${maxWeekTime} minutes for ${space.spaceType}`,
      );
    }
  }

  async getReservationBySpaceID(
    spaceId: number,
  ): Promise<IReservationResponse[]> {
    const reservations = await this.reservationRepository.find({ spaceId });
    const userIds = reservations.map((reservation) => reservation.userId);
    const organizationIds = reservations.map((reservation) => reservation.organizationId);

    const [users, space, organizations] = await Promise.all([
      this.userPublicService.fetchAll(userIds).then(takeAll(userIds, 'users')),
      this.spacePublicService.fetchById(spaceId),
      this.organizationPublicService.fetchByOrganizationIds(organizationIds),
    ]) as [IUser[], ISpace, IOrganization[]];

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(organizationIds, organizations, 'organizations');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find(user => user.id === reservation.userId)!,
      organization: organizations.find(org => org.id === reservation.organizationId)!,
      space,
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
  ): Promise<MReservation> {
    // Validate time constraints before creating reservation
    await this.validateTimeConstraints(
      reservationInput.userId,
      reservationInput.spaceId,
      reservationInput.timeFrom,
      reservationInput.timeTo,
    );

    const space = await this.spacePublicService.fetchById(reservationInput.spaceId);

    // Check if the time is available
    const isAvailable = await this.reservationPublicService.checkReservationAvailability(
      reservationInput.userId,
      reservationInput.spaceId,
      reservationInput.timeFrom,
      reservationInput.timeTo,
    );

    if (!isAvailable) {
      throw new BadRequestException('Time is not available');
    }

    const reservation = await this.reservationRepository.insert({
      ...reservationInput,
      state: this.getDefaultStatus(space.spaceType),
    });

    return reservation;
  }

  async updateReservation(
    reservationInput: IReservationUpdate,
  ): Promise<boolean> {
    const reservation = await this.reservationRepository
      .find({
        id: reservationInput.id,
      })
      .then(takeOne('reservation'));

    // If updating time or state to GRANT, validate time constraints
    if (
      (reservationInput.timeFrom && reservationInput.timeTo) ||
      (reservation.state !== ReservationStateEnum.GRANT &&
        reservationInput.state === ReservationStateEnum.GRANT)
    ) {
      await this.validateTimeConstraints(
        reservation.userId,
        reservation.spaceId,
        reservationInput.timeFrom || reservation.timeFrom,
        reservationInput.timeTo || reservation.timeTo,
        reservation.id,
      );
    }

    // Check availability if changing to GRANT state
    if (
      reservation.state !== ReservationStateEnum.GRANT &&
      reservationInput.state === ReservationStateEnum.GRANT
    ) {
      const isAvailable = await this.reservationPublicService.checkReservationAvailability(
        reservation.userId,
        reservation.spaceId,
        reservation.timeFrom,
        reservation.timeTo,
      );

      if (!isAvailable) {
        throw new BadRequestException('Time is not available');
      }
    }

    const newReservation = {
      ...reservation,
      ...reservationInput,
    };

    return await this.reservationRepository.update(newReservation);
  }

  async getManageReservation(): Promise<IReservationResponse[]> {
    const reservations = await this.reservationRepository.find({
      states: [ReservationStateEnum.RECEIVED, ReservationStateEnum.WAIT],
    });

    const userIds = reservations.map((reservation) => reservation.userId);
    const organizationIds = reservations.map((reservation) => reservation.organizationId);
    const spaceIds = reservations.map((reservation) => reservation.spaceId);

    const [users, organizations, spaces] = await Promise.all([
      this.userPublicService.fetchAll(userIds).then(takeAll(userIds, 'users')),
      this.organizationPublicService.fetchByOrganizationIds(organizationIds),
      this.spacePublicService.fetchAllByIds(spaceIds),
    ]) as [IUser[], IOrganization[], ISpace[]];

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(organizationIds, organizations, 'organizations');
    checkContainAllId(spaceIds, spaces, 'spaces');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find(user => user.id === reservation.userId)!,
      organization: organizations.find(org => org.id === reservation.organizationId)!,
      space: spaces.find(space => space.id === reservation.spaceId)!,
    }));
  }

  async getReservationListByUserId(
    userId: number,
  ): Promise<IReservationResponse[]> {
    const reservations = await this.reservationRepository.find({
      userId,
    });

    const userIds = reservations.map((reservation) => reservation.userId);
    const organizationIds = reservations.map((reservation) => reservation.organizationId);
    const spaceIds = reservations.map((reservation) => reservation.spaceId);

    const [users, organizations, spaces] = await Promise.all([
      this.userPublicService.fetchAll(userIds).then(takeAll(userIds, 'users')),
      this.organizationPublicService.fetchByOrganizationIds(organizationIds),
      this.spacePublicService.fetchAllByIds(spaceIds),
    ]) as [IUser[], IOrganization[], ISpace[]];

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(organizationIds, organizations, 'organizations');
    checkContainAllId(spaceIds, spaces, 'spaces');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find(user => user.id === reservation.userId)!,
      organization: organizations.find(org => org.id === reservation.organizationId)!,
      space: spaces.find(space => space.id === reservation.spaceId)!,
    }));
  }

  private getDefaultStatus(spaceType: SpaceTypeEnum): ReservationStateEnum {
    switch (spaceType) {
      // 기본적으로 GRANT 상태로 예약
      case SpaceTypeEnum.INDIVIDUAL:
      case SpaceTypeEnum.PIANO:
      case SpaceTypeEnum.SEMINAR:
      case SpaceTypeEnum.DANCE:
      case SpaceTypeEnum.GROUP:
      case SpaceTypeEnum.OPEN:
      case SpaceTypeEnum.WORK:
        return ReservationStateEnum.GRANT;
      // WAIT 상태로 예약
      case SpaceTypeEnum.MIRAE:
      case SpaceTypeEnum.SUMI:
        return ReservationStateEnum.WAIT;
    }
  }
}
