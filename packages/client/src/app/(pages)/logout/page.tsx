"use client";

import axios, { AxiosResponse } from "axios";
import React from "react";
import { useRouter, usePathname } from "next/navigation"; // next/router 대신 next/navigation 사용
import { LckResType } from "@depot/types/auth";

async function sendPost(): Promise<AxiosResponse<LckResType>> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/verification`;
  console.log(url);
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await axios.post<LckResType>(url, JSON.stringify({}), config);
}

const LogOutPage: React.FC = () => {
  const router = useRouter(); // next/router 대신 next/navigation 사용
  const location = process.env.NEXT_PUBLIC_SS_URL
    ? `${process.env.NEXT_PUBLIC_SS_URL}?${new Date().getTime()}&redirect_url=${encodeURI(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/logout`
      )}`
    : "";

  const handleSubmit = (): void => {
    window.location.href = location;
  };

  handleSubmit();

  return <div id="main"></div>;
};

export default LogOutPage;
