"use client"

import ReservationList from "../Reservation/ReservationList";
import PageSelector, { IPage } from "../PageSelector/PageSelector";
import Organization from "../Organization/Organization";

export default function Mypage() {
  const pages: IPage[] = [
    {
      kor: "예약 목록",
      eng: "Reservation List",
      preview: (<ReservationList />),
      href: "/mypage"
    },
    {
      kor: "단체 관리",
      eng: "Organization",
      preview: (<Organization />),
      href: "/mypage/org"
    },
  ];

  return (
    <PageSelector
      pages={pages}
    />
  );
}
