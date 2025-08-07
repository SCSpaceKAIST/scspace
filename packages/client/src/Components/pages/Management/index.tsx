"use client"

import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageSelector, { IPage } from "../../molecules/page/PageSelector";
import ManageOrganization from "./Organization";
import ManageReservation from "./Reservation";

export default function Management() {
  const { needManager } = useAuth();
  needManager();

  const pages: IPage[] = [
    {
      href: "/manage/organization",
      kor: "조직",
      eng: "Organization",
      preview: (<ManageOrganization />)
    },
    {
      href: "/manage/reservation",
      kor: "예약",
      eng: "Reservation",
      preview: (<ManageReservation />)
    }
  ]

  return (
    <PageSelector
      pages={pages}
    />
  );
};