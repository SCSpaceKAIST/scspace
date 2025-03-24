"use client";

import React, { useEffect } from "react";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";

const LoginPage: React.FC = () => {
  const { linkPush } = useLinkPush();
  const { isLogined } = useLoginCheck();

  useEffect(() => {
    if (isLogined) {
      alert("이미 로그인 되어 있습니다.");
      linkPush("/");
      return;
    }

    const location = process.env.NEXT_PUBLIC_SS_URL
      ? `${process.env.NEXT_PUBLIC_SS_URL}?${new Date().getTime()}&redirect_url=${encodeURI(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        )}`
      : "";
    console.log("location", location);

    window.location.href = location;
  }, [isLogined, linkPush]);

  return (
    <div id="main">
      <div>잠시 기다리면 로그인 페이지로 넘어갑니다...</div>
    </div>
  );
};

export default LoginPage;
