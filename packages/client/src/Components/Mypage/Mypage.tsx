import PageSelector, { IPage } from "../PageSelector/PageSelector";
import Organization from "../Organization/Organization";
import UserReservation from "../UserRevervation/UserReservation";

export default function Mypage() {
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
