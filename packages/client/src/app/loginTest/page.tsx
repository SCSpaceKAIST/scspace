"use client"; // 이 지시어를 추가하여 이 컴포넌트를 클라이언트 전용으로 만듭니다.

import axios, { AxiosResponse } from "axios";
import React from "react";
import { useRouter } from "next/navigation"; // next/router 대신 next/navigation 사용

interface SsoResponse {
  data: any;
}

async function sendPost(): Promise<AxiosResponse<SsoResponse>> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/verification`;
  console.log(url);
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await axios.post<SsoResponse>(url, JSON.stringify({}), config);
}

async function LoginCheck(): Promise<any> {
  const res = await sendPost();
  const body = res.data;
  return body;
}

const Login: React.FC = () => {
  const router = useRouter(); // next/router 대신 next/navigation 사용
  const location = process.env.NEXT_PUBLIC_SS_URL
    ? `${process.env.NEXT_PUBLIC_SS_URL}?${new Date().getTime()}&redirect_url=${encodeURI(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/login`
      )}`
    : "";

  const checkSubmit = async (): Promise<boolean> => {
    return true;
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

  const verifyBtn = async (): Promise<void> => {
    LoginCheck().then((result) => {
      console.log(result);
      window.alert(result);
    });
  };

  const logoutBtn = async (): Promise<void> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post<SsoResponse>(url, JSON.stringify({}), config);
  };
  const guardBtn = async (): Promise<void> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/user/idJwt`;
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = await axios.get(url, config);
    console.log(data);
    window.alert(JSON.stringify(data));
    console.log(url);
  };

  return (
    <div id="main">
      <button onClick={handleSubmit}>로그인</button>
      <button onClick={verifyBtn}>로그인 확인</button>
      <button onClick={logoutBtn}>로그아웃</button>
      <button onClick={guardBtn}>가드버튼</button>
    </div>
  );
};

export default Login;
