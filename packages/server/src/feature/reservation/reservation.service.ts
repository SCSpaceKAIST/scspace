import {
  IReservationCreate,
  IReservationUpdate,
  IReservationAll,
  IReservationContent,
  IReservation,
} from '@scspace-depot/types/reservation';
import { IOrganization } from '@scspace-depot/types/organization';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { checkContainAllId, takeAll } from '@scspace-server/common/utils';
import { ReservationStateEnum } from '@scspace-depot/enums/reservation.enum';
import { IUser } from '@scspace-depot/types/user';
import { ISpace } from '@scspace-depot/types/space';
import { MReservation } from '@scspace-server/feature/reservation/reservation.model';
import { IDataResponse, ISuccessResponse } from '@scspace-depot/types/common';
import { UserTypeEnum } from '@scspace-depot/enums/user.enum';
import { MailService } from '@scspace-server/tools/mailer/mail.service';
import { ReservationMeta } from '@scspace-depot/enums/mail.enum';
import { getString } from '@scspace-server/common/utils'
import { ReservationRepository } from '@scspace-server/feature/reservation/reservation.repository';
import { ReservationPublicService } from '@scspace-server/feature/reservation/reservation.public.service';
import { SpacePublicService } from '@scspace-server/feature/space/space.public.service';
import { UserPublicService } from '@scspace-server/feature/user/user.public.service';
import { OrganizationPublicService } from '@scspace-server/feature/organization/organization.public.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationPublicService: ReservationPublicService,
    private readonly spacePublicService: SpacePublicService,
    private readonly userPublicService: UserPublicService,
    private readonly organizationPublicService: OrganizationPublicService,
    private readonly mailService: MailService,
  ) { }

  async getReservationBySpaceIDBetweenTime(
    spaceId: number,
    timeFrom?: number,
    timeTo?: number,
  ): Promise<IReservationAll[]> {

    if (timeFrom && timeTo) {
      if (timeFrom > timeTo) throw new BadRequestException('timeFrom must be before timeTo');
      const oneDayInMs = BigInt(60) * BigInt(24);
      timeTo = Number(BigInt(timeTo) + oneDayInMs - BigInt(1));
    }
    // If either timeFrom or timeTo is missing, fetch all reservations for the space
    const { data: reservations } = await this.reservationRepository.fetch({
      spaceId,
      ...(timeFrom && timeTo ? { timeRange: { timeFrom: timeFrom, timeTo: timeTo } } : {})
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
    organizationId: number,
    limit: number,
    offset: number,
  ): Promise<IDataResponse<IReservationAll[]>> {
    let { data: reservations, count } = await this.reservationRepository.fetchByUserId(userId, organizationId, limit, offset);

    const userIds = reservations.map((r) => r.userId);
    const organizationIds = reservations.map((r) => r.organizationId);
    const spaceIds = reservations.map((r) => r.spaceId);

    const [users, organizations, spaces, reservationContents] = await Promise.all([
      this.userPublicService.fetchAllByIds(userIds).then(takeAll(userIds, 'users')),
      this.organizationPublicService.fetchByIds(organizationIds),
      this.spacePublicService.fetchAllByIds(spaceIds),
      this.reservationPublicService.getReservationContentByIds(reservations.map((reservation) => reservation.id)),
    ]) as [IUser[], IOrganization[], ISpace[], IReservationContent[]];

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(organizationIds, organizations, 'organizations');
    checkContainAllId(spaceIds, spaces, 'spaces');

    return {
      data: reservations.map((reservation) => ({
        ...reservation,
        user: users.find(user => user.id === reservation.userId)!,
        organization: organizations.find(org => org.id === reservation.organizationId)!,
        space: spaces.find(space => space.id === reservation.spaceId)!,
        content: reservationContents.find(content => content.id === reservation.id)!,
      })),
      count
    };
  }

  async getReservationList(
    organizationId: number,
    limit: number,
    offset: number,
  ): Promise<IDataResponse<IReservationAll[]>> {
    const { data: reservations, count } = await this.reservationRepository.fetch({
      organizationId,
      limit,
      offset,
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

    return {
      data: reservations.map((reservation) => ({
        ...reservation,
        user: users.find(user => user.id === reservation.userId)!,
        organization: organizations.find(org => org.id === reservation.organizationId)!,
        space: spaces.find(space => space.id === reservation.spaceId)!,
        content: reservationContents.find(content => content.id === reservation.id)!,
      })),
      count
    };
  }
  // 사용안함
  // private getDefaultStatus(spaceType: SpaceTypeEnum): ReservationStateEnum {
  //   switch (spaceType) {
  //     // 기본적으로 GRANT 상태로 예약
  //     case SpaceTypeEnum.INDIVIDUAL:
  //     case SpaceTypeEnum.PIANO:
  //     case SpaceTypeEnum.SEMINAR:
  //     case SpaceTypeEnum.DANCE:
  //     case SpaceTypeEnum.GROUP:
  //     case SpaceTypeEnum.OPEN:
  //     case SpaceTypeEnum.WORK:
  //       return ReservationStateEnum.GRANT;
  //     // WAIT 상태로 예약
  //     case SpaceTypeEnum.MIRAE:
  //     case SpaceTypeEnum.SUMI:
  //       return ReservationStateEnum.WAIT;
  //   }
  // }

  async postReservation(
    reservationInput: IReservationCreate,
  ): Promise<IReservation> {

    await this.reservationPublicService.checkWholeTime(
      reservationInput.userId,
      reservationInput.organizationId,
      reservationInput.spaceId,
      reservationInput.timeFrom,
      reservationInput.timeTo
    );

    const [user, organization, space] = await Promise.all([
      this.userPublicService.fetchById(reservationInput.userId),
      this.organizationPublicService.fetchById(reservationInput.organizationId),
      this.spacePublicService.fetchById(reservationInput.spaceId),
    ]);

    if (!user) throw new BadRequestException('User not found');
    if (!organization) throw new BadRequestException('Organization not found');
    if (!space) throw new BadRequestException('Space not found');

    // 세미나실 추첨 기간 겹침 검증
    await this.reservationPublicService.validateSeminarLotteryConflict(reservationInput.userId, space, reservationInput.timeFrom, reservationInput.timeTo);

    if (user.type !== UserTypeEnum.MANAGER && user.type !== UserTypeEnum.ADMIN) {
      const userOrganizations = await this.organizationPublicService.fetchByUserId(reservationInput.userId);
      if (!userOrganizations.some(org => org.id === reservationInput.organizationId)) {
        throw new BadRequestException('User does not belong to the specified organization');
      }
    }

    const [reservation, reservationContent] = await this.reservationRepository.insert(reservationInput);

    const timeFrom = getString(reservation.timeFrom)
    const timeTo = getString(reservation.timeTo)

    //조직의 경우 모든 구성원에게 발송함 Notif
    const templateFooter: string = organization.id === 1 ? "문의사항이 있으시면 언제든 연락해 주세요." : "이 메일은 예약자 본인 및 조직에 등록된 모든 구성원에게 발송되었습니다."
    const templateFooterEn: string = organization.id === 1 ? "Please feel free to contact us if you have any questions." : "This email has been sent to the reservation holder and all members registered with the organization."
    const meta = { ...ReservationMeta.ReservationCompleted, timeFrom, timeTo, templateFooter, templateFooterEn }

    // organizations의 모든 멤버 가져오기 when org.id !== 1 >> 성능 개선
    const organizationWithMembers = organization.id !== 1 ? await this.organizationPublicService.fetchDeepById(organization.id) : undefined

    if (!organizationWithMembers && organization.id !== 1) {
      throw new BadRequestException('Organization fetch error : Please Contact by Email.')
    }

    try {
      await this.mailService.sendMail({
        to: organization.id === 1 ? user.email : organizationWithMembers.members.map(member => member.user.email),
        subject: `[SCSpace] Reservation Confirmed - ${reservation.title}`,
        // bcc: 'scspace.kaist@gmail.com',
        template: "reservationPosted",
        replyTo: "scspace@kaist.ac.kr",
        context: {
          reservation: {
            ...reservation,
            user,
            space,
            organization
          },
          meta
        }
      })
    } catch (error) {
      console.log(error)
      await this.mailService.reportError(
        error instanceof Error
          ? error
          : new Error(String(error)),
        "Post New Reservation - Mail Sector")
    }

    return MReservation.fromDB(
      reservation,
      reservationContent,
    )
  }

  async updateReservation(
    reservationInput: IReservationUpdate,
  ): Promise<MReservation> {
    const { data: reservation } = await this.reservationRepository.fetch({
      id: reservationInput.id,
    });

    if (reservation.length === 0) {
      throw new NotFoundException('Reservation not found');
    }

    await this.reservationPublicService.checkWholeTime(
      reservation[0].userId,
      reservation[0].organizationId,
      reservation[0].spaceId,
      reservationInput.timeFrom,
      reservationInput.timeTo,
      reservationInput.id,
    );


    const [user, space, organization] = await Promise.all([
      this.userPublicService.fetchById(reservation[0].userId),
      this.spacePublicService.fetchById(reservation[0].spaceId),
      this.organizationPublicService.fetchById(reservation[0].organizationId)
    ]);

    if (!user) throw new BadRequestException('User not found');
    if (!organization) throw new BadRequestException('Organization not found');
    if (!space) throw new BadRequestException('Space not found');

    // 공간 정보 조회하여 세미나실 추첨 기간 겹침 검증
    await this.reservationPublicService.validateSeminarLotteryConflict(
      reservation[0].userId, space, reservationInput.timeFrom, reservationInput.timeTo
    );

    const [reservationUpdated, reservationContentUpdated] = await this.reservationRepository.update(reservationInput);

    //Mail 관련은 작동하지 않아도 상관없도록 try-catch with await
    try {
      const timeFrom = getString(reservationUpdated.timeFrom)
      const timeTo = getString(reservationUpdated.timeTo)
      const templateFooter: string =
        organization.id === 1
          ? '문의사항이 있으시면 언제든 연락해 주세요.'
          : '이 메일은 예약자 본인 및 조직에 등록된 모든 구성원에게 발송되었습니다.';
      const templateFooterEn: string =
        organization.id === 1
          ? 'Please feel free to contact us if you have any questions.'
          : 'This email has been sent to the reservation holder and all members registered with the organization.';
      const meta = {
        ...ReservationMeta.ReservationUpdated,
        timeFrom,
        timeTo,
        templateFooter,
        templateFooterEn,
      };

      const organizationWithMembers =
        organization.id !== 1
          ? await this.organizationPublicService.fetchDeepById(organization.id)
          : undefined;



      await this.mailService.sendMail({
        to:
          organization.id === 1
            ? user.email
            : organizationWithMembers.members.map((member) => member.user.email),
        subject: `[SCSpace] Reservation Updated - ${reservation[0].title}`,
        bcc: 'scspace.kaist@gmail.com',
        template: 'reservationPosted',
        replyTo: 'scspace@kaist.ac.kr',
        context: {
          reservation: {
            ...reservation[0],
            user,
            space,
            organization,
          },
          meta,
        },
      });
    } catch (error) {
      console.log(error)
      await this.mailService.reportError(
        error instanceof Error
          ? error
          : new Error(String(error)),
        "Update Reservation - Mail Sector")
    }

    return MReservation.fromDB(reservationUpdated, reservationContentUpdated);
  }

  async deleteReservation(id: number, user: IUser): Promise<ISuccessResponse> {
    const { data: reservation } = await this.reservationRepository.fetch({
      id: id,
    });
    if (reservation.length === 0) {
      throw new NotFoundException('Reservation not found');
    }
    // individual
    if (id === 1) {
      if (reservation[0].userId !== user.id) {
        throw new BadRequestException(
          'User does not have permission to delete this reservation',
        );
      }
    }
    const [space, organization] = await Promise.all([
      this.spacePublicService.fetchById(reservation[0].spaceId),
      this.organizationPublicService.fetchById(reservation[0].organizationId),
    ]);
    const result = await this.reservationRepository.delete(id);
    if (!result) {
      throw new NotFoundException('Reservation not found');
    }

    //Mail관련은 전부 try-catch with await for Error Control
    try {
      const timeFrom = getString(reservation[0].timeFrom);

      const timeTo = getString(reservation[0].timeTo);

      //조직의 경우 모든 구성원에게 발송함 Notif
      const templateFooter: string =
        organization.id === 1
          ? '문의사항이 있으시면 언제든 연락해 주세요.'
          : '이 메일은 예약자 본인 및 조직에 등록된 모든 구성원에게 발송되었습니다.';
      const templateFooterEn: string =
        organization.id === 1
          ? 'Please feel free to contact us if you have any questions.'
          : 'This email has been sent to the reservation holder and all members registered with the organization.';
      const meta = {
        ...ReservationMeta.ReservationDeleted,
        timeFrom,
        timeTo,
        templateFooter,
        templateFooterEn,
      };

      const organizationWithMembers =
        organization.id !== 1
          ? await this.organizationPublicService.fetchDeepById(organization.id)
          : undefined;

      await this.mailService.sendMail({
        to:
          organization.id === 1
            ? user.email
            : organizationWithMembers.members.map((member) => member.user.email),
        subject: `[SCSpace] Reservation Deleted - ${reservation[0].title}`,
        bcc: 'scspace.kaist@gmail.com',
        template: 'reservationPosted',
        replyTo: 'scspace@kaist.ac.kr',
        context: {
          reservation: {
            ...reservation[0],
            user,
            space,
            organization,
          },
          meta,
        },
      });
    } catch (error) {
      console.log(error)
      await this.mailService.reportError(
        error instanceof Error
          ? error
          : new Error(String(error)),
        "Delete Reservation - Mail Sector")
    }
    return {
      success: true,
    };
  }

  async getManageReservation(): Promise<IReservationAll[]> {
    const { data: reservations } = await this.reservationRepository.fetch({
      states: [ReservationStateEnum.RECEIVED, ReservationStateEnum.WAIT],
    });

    const userIds = reservations.map((reservation) => reservation.userId);
    const organizationIds = reservations.map(
      (reservation) => reservation.organizationId,
    );
    const spaceIds = reservations.map((reservation) => reservation.spaceId);

    const [users, organizations, spaces, reservationContents] =
      (await Promise.all([
        this.userPublicService
          .fetchAllByIds(userIds)
          .then(takeAll(userIds, 'users')),
        this.organizationPublicService.fetchByIds(organizationIds),
        this.spacePublicService.fetchAllByIds(spaceIds),
        this.reservationPublicService.getReservationContentByIds(
          reservations.map((reservation) => reservation.id),
        ),
      ])) as [IUser[], IOrganization[], ISpace[], IReservationContent[]];

    checkContainAllId(userIds, users, 'users');
    checkContainAllId(organizationIds, organizations, 'organizations');
    checkContainAllId(spaceIds, spaces, 'spaces');

    return reservations.map((reservation) => ({
      ...reservation,
      user: users.find((user) => user.id === reservation.userId)!,
      organization: organizations.find(
        (org) => org.id === reservation.organizationId,
      )!,
      space: spaces.find((space) => space.id === reservation.spaceId)!,
      content: reservationContents.find(
        (content) => content.id === reservation.id,
      )!,
    }));
  }
}
