"use client";

import React from "react";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";

const LoginPage: React.FC = () => {
  const { linkPush } = useLinkPush();
  const { isLogined } = useLoginCheck();
  const location = process.env.NEXT_PUBLIC_SS_URL
    ? `${process.env.NEXT_PUBLIC_SS_URL}?${new Date().getTime()}&redirect_url=${encodeURI(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      )}`
    : "";
  console.log("location", location);

  const handleSubmit = (): void => {
    console.log("location", location);

    if (!isLogined) {
      console.log("location", location);
      window.location.href = location;
    } else {
      alert("이미 로그인 되어 있습니다.");
      linkPush("/"); // next/router 대신 next/navigation 사용
    }
  };

  handleSubmit();
  return (
    <div id="main">
      <button onClick={handleSubmit}>로그인</button>
    </div>
  );
};

export default LoginPage;
