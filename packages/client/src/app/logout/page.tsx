"use client";

import React, { useEffect } from "react";
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";
import { useMutationApi } from "@scspace-client/Hooks/useApi";
const LogOutPage: React.FC = () => {
  const { linkPush } = useLinkPush();
  const { mutateAsync: sendLogout } = useMutationApi<Response, {}>(
    "/auth/logout",
    "POST",
  );

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await sendLogout({});
        console.log("response", response);
        if (response.status === 302) {
          // 리다이렉션 URL을 가져와서 linkPush로 이동
          const redirectUrl = response.headers.get("Location"); // 리다이렉션 URL
          if (redirectUrl) {
            linkPush(redirectUrl);
          } else {
            linkPush("/"); // 기본 리다이렉션
          }
        } else {
          linkPush("/"); // 기본 리다이렉션
        }
      } catch (error) {
        console.error("Logout error:", error);
        // 뭔가 여기에 걸리긴 하는데 아무튼 해결???
        // Technical Debt
        linkPush("/");
      }
    };
    logout();
  }, []);

  return <div id="main"></div>;
};

export default LogOutPage;
