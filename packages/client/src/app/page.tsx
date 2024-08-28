"use client";
import React, { useState, useEffect } from "react";
//import Password from "./Password";
//import EmergencyNotice from "./notice/EmergencyNotice";
import Banner from "@Components/Main/Banner";
import Faq from "@Components/FAQ/Faq";
//import FastNotice from "./notice/FastNotice";
//import FAQ from "./faq/FAQ";
import LoginCheck from "@Components/Auth/LoginCheck";
import { LckResType } from "@depot/types/auth";
import axios from "axios";
import FastNotice from "@/Components/Main/FastNotice";

interface MainProps {
  // Next.js에서는 history가 기본으로 제공되지 않으므로,
  // 필요에 따라 history 사용 방법을 조정해야 합니다.
  history?: any; // 필요시 history 타입을 명확히 정의할 수 있습니다.
}

const Main: React.FC<MainProps> = (props) => {
  const [gprValid, setGprValid] = useState<boolean>(false);
  const [wsValid, setWsValid] = useState<boolean>(false);
  let studentID: string | null = null;

  const callApi_grp = async (): Promise<boolean> => {
    const res = await axios.get(`/api/etc/check_reserved_grp?id=${studentID}`);
    const body = await res.data;
    return body;
  };

  const callApi_ws = async (): Promise<boolean> => {
    const res = await axios.get(`/api/etc/check_reserved_ws?id=${studentID}`);
    const body = await res.data;
    return body;
  };

  useEffect(() => {
    LoginCheck().then((result: LckResType) => {
      // if (result) {
      //   studentID = result.user_id;
      //   if (result.type === "admin") {
      //     setGprValid(true);
      //     setWsValid(true);
      //   } else {
      //     callApi_grp().then((result) => {
      //       setGprValid(result);
      //     });
      //     callApi_ws().then((result) => {
      //       setWsValid(result);
      //     });
      //   }
      // } else {
      //   setGprValid(false);
      //   setWsValid(false);
      // }
    });
  }, []);

  return (
    <div>
      <div className="top-margin2">{/* <EmergencyNotice/> */}</div>
      <Banner />
      <FastNotice />
      <Faq />
    </div>
  );
};

export default Main;
