import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  AdminGuard,
  DelegatorGuard,
  ManagerGuard,
  MemberGuard,
  MemberGuardWithReservation,
  UserGuard,
} from '@scspace-server/feature/auth/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';

export function AuthAdmin() {
  return applyDecorators(
    UseGuards(AdminGuard),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '성공',
    }),
    ApiResponse({
      status: 401,
      description: '로그인이 필요합니다.',
    }),
    ApiResponse({
      status: 403,
      description: '권한이 없습니다.',
    }),
  );
}

export function AuthManager() {
  return applyDecorators(
    UseGuards(ManagerGuard),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({
      status: 401,
      description: '로그인이 필요합니다.',
    }),
    ApiResponse({
      status: 403,
      description: '권한이 없습니다.',
    }),
  );
}

export function AuthUser() {
  return applyDecorators(
    UseGuards(UserGuard),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({
      status: 401,
      description: '로그인이 필요합니다.',
    }),
    ApiResponse({
      status: 403,
      description: '권한이 없습니다.',
    }),
  );
}

export function AuthMember() {
  return applyDecorators(
    UseGuards(MemberGuard),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({
      status: 401,
      description: '로그인이 필요합니다.',
    }),
    ApiResponse({
      status: 403,
      description: '권한이 없습니다.',
    }),
  );
}

export function AuthMemberWithReservation() {
  return applyDecorators(
    UseGuards(MemberGuardWithReservation),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({
      status: 401,
      description: '로그인이 필요합니다.',
    }),
    ApiResponse({
      status: 403,
      description: '권한이 없습니다.',
    }),
  );
}

export function AuthDelegator() {
  return applyDecorators(
    UseGuards(DelegatorGuard),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: '성공' }),
    ApiResponse({
      status: 401,
      description: '로그인이 필요합니다.',
    }),
    ApiResponse({
      status: 403,
      description: '권한이 없습니다.',
    }),
  );
} 