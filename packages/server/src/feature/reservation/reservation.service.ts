import {
  ISpaceTimeCheckRequest,
  IUserTimeCheckRequest,
  IReservationCreate,
  IReservationUpdate,
  IReservationAll,
  IReservationContent,
  IReservation,
} from '@scspace-depot/types/reservation';
import { IOrganization } from '@scspace-depot/types/organization';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { checkContainAllId, formatDateToSQL, takeAll, timeRangeCheck } from 'src/common/util';
import { UserPublicService } from '../user/user.public.service';
import { SpacePublicService } from '../space/space.public.service';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { ReservationPublicService } from './reservation.public.service';
import { IUser } from '@scspace-depot/types/user';
import { ISpace } from '@scspace-depot/types/space';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
import { OrganizationPublicService } from '../organization/organization.public.service';
import { MReservation, MReservationContent } from './reservation.model';
import { ISuccessResponse } from '@scspace-depot/types/common';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationPublicService: ReservationPublicService,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
    private readonly organizationPublicService: OrganizationPublicService,
  ) {}

  async getReservationBySpaceIDBetweenTime(
    spaceId: number,
    timeFrom?: string,
    timeTo?: string,
  ): Promise<IReservationAll[]> {

    let timeFromDate: Date;
    let timeToDate: Date;

    if (timeFrom && timeTo) {
      if (timeFrom === timeTo) {
        timeFromDate = new Date(timeFrom);
        timeToDate = new Date(new Date(timeTo).getTime() + (1000 * 60 * 60 * 24-1));
      } else {
        timeFromDate = new Date(timeFrom);
        timeToDate = new Date(timeTo);
      }
      if (!timeRangeCheck(timeFromDate, timeToDate)) {
        throw new BadRequestException('timeFrom must be before timeTo');
      }
    }
    // If either timeFrom or timeTo is missing, fetch all reservations for the space
    const reservations = await this.reservationRepository.fetch({ 
      spaceId, 
      ...(timeFrom && timeTo ? { timeRange: { timeFrom: formatDateToSQL(timeFromDate), timeTo: formatDateToSQL(timeToDate) } } : {})
    });
    if (reservations.length === 0) {
      return [];
    }

    const userIds = reservations.map((reservation) => reservation.userId);
    const organizationIds = reservations.map((reservation) => reservation.organizationId);

    const [users, space, organizations, reservationContents] = await Promise.all([
      this.userPublicService.fetchAllByIds(userIds).then(takeAll(userIds, 'users')),
      this.spacePublicService.fetchById(spaceId),
      this.organizationPublicService.fetchByIds(organizationIds),
      this.reservationPublicService.getReservationContentByIds(reservations.map((reservation) => reservation.id)),
    ]) as [IUser[], ISpace, IOrganization[], IReservationContent[]];

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(organizationIds, organizations, 'organizations');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find(user => user.id === reservation.userId)!,
      organization: organizations.find(org => org.id === reservation.organizationId)!,
      space,
      content: reservationContents.find(content => content.id === reservation.id)!,
    }));
  }

  async getReservationListByUserId(
    userId: number,
    limit: number,
  ): Promise<IReservationAll[]> {
    const reservations = await this.reservationRepository.fetch({
      userId: userId,
      limit: limit,
    });

    const userIds = reservations.map((reservation) => reservation.userId);
    const organizationIds = reservations.map((reservation) => reservation.organizationId);
    const spaceIds = reservations.map((reservation) => reservation.spaceId);

    const [users, organizations, spaces, reservationContents] = await Promise.all([
      this.userPublicService.fetchAllByIds(userIds).then(takeAll(userIds, 'users')),
      this.organizationPublicService.fetchByIds(organizationIds),
      this.spacePublicService.fetchAllByIds(spaceIds),
      this.reservationPublicService.getReservationContentByIds(reservations.map((reservation) => reservation.id)),
    ]) as [IUser[], IOrganization[], ISpace[], IReservationContent[]];

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(organizationIds, organizations, 'organizations');
    checkContainAllId(spaceIds, spaces, 'spaces');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find(user => user.id === reservation.userId)!,
      organization: organizations.find(org => org.id === reservation.organizationId)!,
      space: spaces.find(space => space.id === reservation.spaceId)!,
      content: reservationContents.find(content => content.id === reservation.id)!,
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


  async postReservation(
    reservationInput: IReservationCreate,
  ): Promise<IReservation> {

    await this.reservationPublicService.checkWholeTime(reservationInput.userId, reservationInput.spaceId, new Date(reservationInput.timeFrom), new Date(reservationInput.timeTo));

    const [user, organizations, space] = await Promise.all([
      this.userPublicService.fetchById(reservationInput.userId),
      this.organizationPublicService.fetchById(reservationInput.organizationId),
      this.spacePublicService.fetchById(reservationInput.spaceId),
    ]);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!organizations) {
      throw new BadRequestException('Organization not found');
    }

    if (!space) {
      throw new BadRequestException('Space not found');
    }

    const userOrganizations = await this.organizationPublicService.fetchByUserId(reservationInput.userId);
    if (!userOrganizations.some(org => org.id === reservationInput.organizationId)) {
      throw new BadRequestException('User does not belong to the specified organization');
    }

    const [reservation, reservationContent] = await this.reservationRepository.insert(reservationInput);

    return MReservation.fromDB(
      reservation,
      reservationContent,
    );
  }

  async updateReservation(
    reservationInput: IReservationUpdate,
  ): Promise<MReservation> {
    const reservation = await this.reservationRepository.fetch({
      id: reservationInput.id,
    });

    if (reservation.length === 0) {
      throw new NotFoundException('Reservation not found');
    }

    await this.reservationPublicService.checkWholeTime(reservation[0].userId, reservation[0].spaceId, new Date(reservationInput.timeFrom), new Date(reservationInput.timeTo));

    const [reservationUpdated, reservationContentUpdated] = await this.reservationRepository.update(reservationInput);
    return MReservation.fromDB(
      reservationUpdated,
      reservationContentUpdated,
    );
  }

  async deleteReservation(id: number): Promise<ISuccessResponse> {
    const result = await this.reservationRepository.delete(id);
    if (!result) {
      throw new NotFoundException('Reservation not found');
    }
    return {
      success: true,
    };
  }

  async getManageReservation(): Promise<IReservationAll[]> {
    const reservations = await this.reservationRepository.fetch({
      states: [ReservationStateEnum.RECEIVED, ReservationStateEnum.WAIT],
    });

    const userIds = reservations.map((reservation) => reservation.userId);
    const organizationIds = reservations.map((reservation) => reservation.organizationId);
    const spaceIds = reservations.map((reservation) => reservation.spaceId);

    const [users, organizations, spaces, reservationContents] = await Promise.all([
      this.userPublicService.fetchAllByIds(userIds).then(takeAll(userIds, 'users')),
      this.organizationPublicService.fetchByIds(organizationIds),
      this.spacePublicService.fetchAllByIds(spaceIds),
      this.reservationPublicService.getReservationContentByIds(reservations.map((reservation) => reservation.id)),
    ]) as [IUser[], IOrganization[], ISpace[], IReservationContent[]];

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(organizationIds, organizations, 'organizations');
    checkContainAllId(spaceIds, spaces, 'spaces');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find(user => user.id === reservation.userId)!,
      organization: organizations.find(org => org.id === reservation.organizationId)!,
      space: spaces.find(space => space.id === reservation.spaceId)!,
      content: reservationContents.find(content => content.id === reservation.id)!,
    }));
  }
}