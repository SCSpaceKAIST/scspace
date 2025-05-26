"use client"

import PageSelector, { IPage } from "../PageSelector/PageSelector";
import Organization from "../Organization/Organization";
import UserReservation from "../Reservation/UserRevervation/UserReservation";

export default function Mypage() {
  const pages: IPage[] = [
    {
      kor: "예약 목록",
      eng: "Reservation List",
      preview: (<UserReservation />),
      href: "/mypage"
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
