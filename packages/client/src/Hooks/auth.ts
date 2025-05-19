"use client";

import { useQueryApi } from "@scspace-client/Hooks/useAPI";
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";
import { IUser } from "@scspace-depot/types/user";
import { IVerificationResponse } from "@scspace-depot/types/auth/auth.type";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";

export const useAuth = () => {
  const { data, isLoading, refetch } = useQueryApi<IVerificationResponse>("/auth/verification");

  const userInfo: IUser | null = data?.isLogined ? data.userInfo : null;
  const isLogined = !!userInfo;
  const { linkPush } = useLinkPush();

  // 로그인 필수 페이지에서 사용
  const needLogin = () => {
    if (!isLoading && !isLogined) {
      alert("로그인이 필요합니다.");
      linkPush("/login");
    }
  };

  // 관리자만 접근 가능 페이지에서 사용
  const needAdmin = () => {
    if (isLoading) return;
    if (!isLogined) {
      needLogin();
      return;
    }
    if (userInfo.type === UserTypeEnum.USER) {
      alert("관리자만 접근 가능한 페이지입니다.");
      linkPush("/");
    }
  };

  // 특정 유저 타입 체크
  const ckUserType = (type: UserTypeEnum | null | undefined): boolean => {
    return isLogined && userInfo?.type === type;
  };

  const isSCS = (): boolean => {
    return isLogined && userInfo?.type !== UserTypeEnum.USER;
  };

  return {
    userInfo,
    isLogined,
    isLoading,
    refetch,
    needLogin,
    needAdmin,
    ckUserType,
    isSCS,
  };
};
