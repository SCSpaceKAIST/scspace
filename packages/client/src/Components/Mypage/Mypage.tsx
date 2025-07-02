import PageSelector, { IPage } from "../PageSelector/PageSelector";
import Organization from "../Organization/Organization";
import UserReservation from "../UserRevervation/UserReservation";
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
