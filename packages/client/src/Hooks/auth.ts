"use client";

import { useLinkPush, useQueryApi } from "@scspace-client/Hooks/api";
import { IUser } from "@scspace-depot/types/user";
import { IVerificationResponse } from "@scspace-depot/types/auth/auth.type";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";

export const useAuth = () => {
  const { data, isLoading, refetch } = useQueryApi<IVerificationResponse>("/auth/verify");

  const userInfo: IUser | null = data?.isLogined ? data.userInfo : null;
  const isLogined = !!userInfo;
  const { linkPush } = useLinkPush();

  const isAdmin = isLogined && userInfo.type === UserTypeEnum.ADMIN;
  const isManager = isLogined && userInfo.type === UserTypeEnum.MANAGER || isAdmin;
  const isWorker = isLogined && userInfo.type === UserTypeEnum.WORKER || isManager;

  // 로그인 필수 페이지에서 사용
  const needLogin = () => {
    if (!isLoading && !isLogined) {
      alert("로그인이 필요합니다.");
      linkPush("/login");
    }
  };

  // 관리자만 접근 가능 페이지에서 사용
  const needManager = () => {
    if (isLoading) return;
    if (!isLogined) {
      needLogin();
      return;
    }
    if (!isManager) {
      alert("The page only for manager, a member of SCSpace.");
      linkPush("/");
    }
  };

  return {
    userInfo,
    isLogined,
    isLoading,
    refetch,
    needLogin,
    needManager,
    isAdmin,
    isManager,
    isWorker,
  };
};

export function useAuthAPI() {
  const { linkPush } = useLinkPush();

  function logout(refetch: () => void) {
    fetch("/api/auth/logout", {
      method: "GET"
    }).then(() => {
      linkPush('/');
      refetch();
    });
  }

  return {
    logout
  }
}