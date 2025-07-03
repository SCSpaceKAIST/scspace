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

  const needLogin = () => {
    if (!isLoading && !isLogined) {
      alert("Sign in is needed");
      linkPush("/login");
    }
  };

  const needWorker = () => {
    needLogin();
    if (!isWorker) {
      alert("The page only for worker; in Korean, 근로장학생.");
      linkPush("/");
    }
  };

  const needManager = () => {
    needLogin();
    if (!isManager) {
      alert("The page only for manager, a member of SCSpace.");
      linkPush("/");
    }
  };

  const needAdmin = () => {
    needLogin();
    if (!isAdmin) {
      alert("The page only for administrator, a executive of SCSpace.");
      linkPush("/");
    }
  };

  return {
    refetch,
    userInfo,
    isLogined,
    isLoading,
    needLogin,
    needWorker,
    needManager,
    needAdmin,
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