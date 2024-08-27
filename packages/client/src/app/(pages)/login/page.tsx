"use client";

import React from "react";
import { useRouter } from "next/navigation"; // next/router 대신 next/navigation 사용
import LoginCheck from "@/Components/Auth/LoginCheck";

const LoginPage: React.FC = () => {
  const router = useRouter(); // next/router 대신 next/navigation 사용
  const location = process.env.NEXT_PUBLIC_SS_URL
    ? `${process.env.NEXT_PUBLIC_SS_URL}?${new Date().getTime()}&redirect_url=${encodeURI(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/login`
      )}`
    : "";

  const checkSubmit = async (): Promise<boolean> => {
    const res = await LoginCheck();
    return res === false;
  };

  const handleSubmit = (): void => {
    checkSubmit().then((result) => {
      console.log(result);
      if (result) {
        window.location.href = location;
      } else {
        alert("로그인 되었습니다.");
        router.push("/"); // next/router 대신 next/navigation 사용
      }
    });
  };
  handleSubmit();
  return (
    <div id="main">
      <button onClick={handleSubmit}>로그인</button>
    </div>
  );
};

export default LoginPage;
