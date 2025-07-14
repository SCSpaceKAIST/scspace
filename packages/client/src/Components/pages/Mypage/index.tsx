"use client"

import PageSelector, { IPage } from "../Layout/PageSelector";
import Organization from "./Organization";
import UserReservation from "./UserReservation";
import { useAuth } from "@scspace-client/Hooks/auth";

export default function Mypage() {
  const { needLogin } = useAuth();
  needLogin();

  const pages: IPage[] = [
    {
      kor: "예약 목록",
      eng: "Reservation List",
      preview: (<UserReservation />),
      href: "/mypage/reservation"
    },
    {
      kor: "조직 관리",
      eng: "Organization",
      preview: (<Organization />),
      href: "/mypage/organization"
    },
  ];

  return (
    <PageSelector
      pages={pages}
    />
  );
}
