import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserTypeEnum } from '@scspace-depot/enums/user.enum';
import { IUser } from '@scspace-depot/types/user';
import { OrganizationPublicService } from '@scspace-server/feature/organization/organization.public.service';
import { ReservationPublicService } from '@scspace-server/feature/reservation/reservation.public.service';

function isManage(user: IUser): boolean {
  return user.type === UserTypeEnum.ADMIN
    || user.type === UserTypeEnum.MANAGER;
}

@Injectable()
export class ManageGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;

    if (isManage(user)) {
      return true;
    }
    return false;
  }
}

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;

    if (user.type === UserTypeEnum.ADMIN) {
      return true;
    }
    return false;
  }
}

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = (request.user as IUser);

    if (isManage(user)) {
      return true;
    }

    const requestUserId = request.params.id;
    if (parseInt(requestUserId) === (user.id)) {
      return true;
    }
    return false;
  }
}
@Injectable()
export class MemberGuard extends AuthGuard('jwt') {
  constructor(
    private readonly organizationPublicService: OrganizationPublicService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 급해서 좀 많이 hard 하게 구성 / individual + param의 경우 알아서 controller에서 추가 검증
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;
    if (isManage(user)) {
      return true;
    }

    let id = 0;
    if (request.params?.id) {
      id = parseInt(request.params.id);
      if (id === 1) {
        if (user.type === UserTypeEnum.ADMIN || user.type === UserTypeEnum.MANAGER) {
          return true;
        } else {
          return false
        }
      }
    } else if (request.body?.organizationId) {
      id = parseInt(request.body.organizationId);
      if (id === 1) {
        const individualUser = request.body.userId;
        if (parseInt(individualUser) === user.id) {
          return true;
        }
      }
    }
    if (id === 0) {
      return false;
    }
    if (id) {
      const organization = await this.organizationPublicService.fetchMembersById(id);
      if (organization.some(member => member.userId === user.id)) {
        return true;
      }
    }
    return false;
  }
}
@Injectable()
export class MemberGuardWithRervation extends AuthGuard('jwt') {
  constructor(
    private readonly organizationPublicService: OrganizationPublicService,
    private readonly reservationPublicService: ReservationPublicService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;
    if (isManage(user)) {
      return true;
    }

    const id = parseInt(request.params.id);
    const reservation = await this.reservationPublicService.fetchById(id);
    if (reservation === null) {
      return false;
    }
    if (reservation.userId === user.id) {
      return true;
    } else if (reservation.organizationId !== 1) {
      const members = await this.organizationPublicService.fetchMembersById(reservation.organizationId);
      if (members.some(member => member.userId === user.id)) {
        return true;
      }
    }
    return false;
  }
}

@Injectable()
export class DelegatorGuard extends AuthGuard('jwt') {
  constructor(
    private readonly organizationPublicService: OrganizationPublicService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = (request.user as IUser);
    if (isManage(user)) {
      return true;
    }

    const delegator = await this.organizationPublicService.fetchDelegatorById(parseInt(request.params.id));
    if (delegator.id === user.id) {
      return true;
    }
    return false;
  }
}