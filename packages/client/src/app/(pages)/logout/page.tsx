"use client";

import axios, { AxiosResponse } from "axios";
import React from "react";
import { useRouter, usePathname } from "next/navigation"; // next/router 대신 next/navigation 사용
const LogOutPage: React.FC = () => {
  const router = useRouter(); // next/router 대신 next/navigation 사용
  const location = `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/logout`;

  const logoutBtn = async (): Promise<void> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post(url, JSON.stringify({}), config);
  };

  const handleSubmit = async (): Promise<void> => {
    await logoutBtn();
    window.location.href = "/";
  };

  handleSubmit();

  return <div id="main"></div>;
};

export default LogOutPage;
