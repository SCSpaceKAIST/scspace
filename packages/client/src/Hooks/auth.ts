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

  function alertMessage(message: string) {
    if (typeof window !== "undefined")
      alert(message);
  }

  const _forceRedirectToLogin = () => {
    alertMessage("Sign in is needed");
    linkPush("/login");
  }

  const needLogin = () => {
    if (!isLoading && !isLogined) _forceRedirectToLogin();
  };

  const needWorker = () => {
    if (!isLoading && !isLogined) _forceRedirectToLogin();
    else if (!isWorker) {
      alertMessage("The page only for worker; in Korean, 근로장학생.");
      linkPush("/");
    }
  };

  const needManager = () => {
    if (!isLoading && !isLogined) _forceRedirectToLogin();
    else if (!isManager) {
      alertMessage("The page only for manager, a member of SCSpace.");
      linkPush("/");
    }
  };

  const needAdmin = () => {
    if (!isLoading && !isLogined) _forceRedirectToLogin();
    else if (!isAdmin) {
      alertMessage("The page only for administrator, a executive of SCSpace.");
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