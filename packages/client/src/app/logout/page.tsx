"use client";

import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // next/router 대신 next/navigation 사용
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";
import { useMutationApi } from "@scspace-client/Hooks/useApi";
const LogOutPage: React.FC = () => {
  const { linkPush } = useLinkPush();
  const { mutateAsync: sendLogout } = useMutationApi("/auth/logout", "POST");

  useEffect(() => {
    const handleSubmit = async (): Promise<void> => {
      await sendLogout({});
      linkPush("/");
    };
    handleSubmit();
  }, []);

  return <div id="main"></div>;
};

export default LogOutPage;
