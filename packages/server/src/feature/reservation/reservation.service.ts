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
import { checkContainAllId, takeAll, takeOne, timeRangeCheck } from 'src/common/util';
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

  async getReservationBySpaceIDBetweenTime(
    spaceId: number,
    timeFrom?: string,
    timeTo?: string,
  ): Promise<IReservationResponse[]> {

    if (timeFrom && timeTo && !timeRangeCheck(timeFrom, timeTo)) {
      throw new BadRequestException('timeFrom must be before timeTo');
    }
    // If either timeFrom or timeTo is missing, fetch all reservations for the space
    const reservations = await this.reservationRepository.find({ 
      spaceId, 
      ...(timeFrom && timeTo ? { timeRange: { timeFrom, timeTo } } : {})
    });
    if (reservations.length === 0) {
      return [];
    }

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
    if (query.timeFrom && query.timeTo && !timeRangeCheck(query.timeFrom, query.timeTo)) {
      throw new BadRequestException('timeFrom must be before timeTo');
    }
    return await this.reservationPublicService.checkTimeAvailability(
      query.spaceId,
      query.timeFrom,
      query.timeTo,
    );
  }

  async checkUserReservationTime(
    query: IUserTimeCheckRequest,
  ): Promise<boolean> {
    if (query.timeFrom && query.timeTo && !timeRangeCheck(query.timeFrom, query.timeTo)) {
      throw new BadRequestException('timeFrom must be before timeTo');
    }
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
    // 1. Validate all referenced entities exist
    const [user, organizations, space] = await Promise.all([
      this.userPublicService.fetchUser(reservationInput.userId),
      this.organizationPublicService.fetchByOrganizationIds([reservationInput.organizationId]),
      this.spacePublicService.fetchById(reservationInput.spaceId),
    ]);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!organizations || organizations.length === 0) {
      throw new BadRequestException('Organization not found');
    }

    if (!space) {
      throw new BadRequestException('Space not found');
    }

    // 2. Check if user belongs to the organization
    const userOrganization = await this.organizationPublicService.fetchByUserId(reservationInput.userId);
    if (!userOrganization || userOrganization.id !== reservationInput.organizationId) {
      throw new BadRequestException('User does not belong to the specified organization');
    }

    if (reservationInput.timeFrom && reservationInput.timeTo && !timeRangeCheck(reservationInput.timeFrom, reservationInput.timeTo)) {
      throw new BadRequestException('timeFrom must be before timeTo');
    }

    // 3. Validate time constraints
    await this.reservationPublicService.validateTimeConstraints(
      reservationInput.userId,
      reservationInput.spaceId,
      reservationInput.timeFrom,
      reservationInput.timeTo,
      { 
        throwError: true,
      }
    );

    // 4. Check if the time is available
    const isAvailable = await this.reservationPublicService.checkTimeAvailability(
      reservationInput.spaceId,
      reservationInput.timeFrom,
      reservationInput.timeTo,
    );

    if (!isAvailable) {
      throw new BadRequestException('Time is not available');
    }

    // 5. Create the reservation
    const reservation = await this.reservationRepository.insert(reservationInput);

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
    if (reservationInput.timeFrom && reservationInput.timeTo) {
      await this.reservationPublicService.validateTimeConstraints(
        reservation.userId,
        reservation.spaceId,
        reservationInput.timeFrom,
        reservationInput.timeTo,
        { 
          throwError: true,
          excludeReservationId: reservation.id 
        }
      );
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
