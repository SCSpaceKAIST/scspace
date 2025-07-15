"use client"

import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageSelector, { IPage } from "../Layout/PageSelector";

export default function Management() {
  const { needManager } = useAuth();
  // needManager();

  const pages: IPage[] = [
    {
      href: "/manage/organization",
      kor: "조직",
      eng: "Organization",
      preview: (
        <div>
          조직 관리 페이지입니다. 조직의 정보를 관리할 수 있습니다.
        </div>
      )
    },
    {
      href: "/manage/reservation",
      kor: "예약",
      eng: "Reservation",
      preview: (
        <div>
          예약 관리 페이지입니다. 공간 예약을 관리할 수 있습니다.
        </div>
      )
    }
  ]

  return (
    <PageSelector
      pages={pages}
    />
  );
};