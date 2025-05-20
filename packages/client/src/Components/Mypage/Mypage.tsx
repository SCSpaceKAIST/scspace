"use client"

import PageSelector, { IPage } from "../PageSelector/PageSelector";
import Organization from "../Organization/Organization";

export default function Mypage() {
  const pages: IPage[] = [
    {
      kor: "예약 목록",
      eng: "Reservation List",
      preview: (<div>Reserv List</div>),
      href: "/mypage"
    },
    {
      kor: "조직 관리",
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
