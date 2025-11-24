import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IUser } from '@scspace-depot/types/user';
import { UserUtils } from '@scspace-depot/utils/user.utils';
import { OrganizationPublicService } from '@scspace-server/feature/organization/organization.public.service';
import { ReservationPublicService } from '@scspace-server/feature/reservation/reservation.public.service';
import { inspect } from 'util';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // canActivate는 기본 동작(super.canActivate)을 그대로 사용해도 되고,
  // 필요 시 커스텀 가능(대개 기본으로 충분)
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 기본 동작: passport 전략을 실행해 user를 주입 시도
    const can = (await super.canActivate(context)) as boolean;
    // 세션을 쓰는 전략이라면 super.logIn(request) 호출이 필요할 수 있음
    // await super.logIn(context.switchToHttp().getRequest());
    return can;
  }

  // 가장 중요: 예외를 삼키고 user만 반환
  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser | undefined {
    // err나 info가 있어도 UnauthorizedException을 던지지 않음
    // user가 없으면 undefined를 반환 → req.user가 undefined로 세팅됨
    return user;
  }
}

@Injectable()
export class ManagerGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;

    if (UserUtils.isManager(user.type)) {
      return true;
    }
    return false;
  }
}

@Injectable()
export class PasspinMasterGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;

    if (UserUtils.isPasspinMaster(user.type)) {
      return true;
    }
    return false;
  }
}

export class AdminGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;

    if (UserUtils.isAdmin(user.type)) {
      return true;
    }
    return false;
  }
}

@Injectable()
export class WorkerGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;

    if (UserUtils.isWorker(user.type)) {
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

    if (UserUtils.isManager(user.type)) {
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
    if (UserUtils.isManager(user.type)) {
      return true;
    }

    let id = 0;
    if (request.params?.id) {
      id = parseInt(request.params.id);
      if (id === 1) {
        if (UserUtils.isManager(user.type)) {
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
export class MemberGuardWithReservation extends AuthGuard('jwt') {
  private readonly logger = new Logger("debug");

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
    if (UserUtils.isManager(user.type)) {
      return true;
    }
    const id = parseInt(
      (request.params && request.params.id) ||
      (request.query && (request.query as any).id) ||
      (request.body && (request.body as any).id));

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
    if (UserUtils.isManager(user.type)) {
      return true;
    }

    const delegator = await this.organizationPublicService.fetchDelegatorById(parseInt(request.params.id));
    if (delegator.id === user.id) {
      return true;
    }
    return false;
  }
}
