"use client";
import React from "react";
import Banner from "@Components/Main/Banner";
import Faq from "@Components/FAQ/Faq";
import FastNotice from "@/Components/Main/FastNotice";

interface MainProps {
  // Next.js에서는 history가 기본으로 제공되지 않으므로,
  // 필요에 따라 history 사용 방법을 조정해야 합니다.
  history?: any; // 필요시 history 타입을 명확히 정의할 수 있습니다.
}

const Main: React.FC<MainProps> = (props) => {
  return (
    <div>
      <Banner />
      <FastNotice />
      <Faq />
    </div>
  );
};

export default Main;
