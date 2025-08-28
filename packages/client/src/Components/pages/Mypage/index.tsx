"use client"

import PageSelector, { IPage } from "../../molecules/page/PageSelector";
import UserOrganization from "./UserOrganization";
import UserRental from "./UserRental";
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
      preview: (<UserOrganization />),
      href: "/mypage/organization"
    },
    {
      kor: "대여 목록",
      eng: "Rental List",
      preview: (<UserRental />),
      href: "/mypage/rental"
    }
  ];

  return (
    <PageSelector
      pages={pages}
    />
  );
}
