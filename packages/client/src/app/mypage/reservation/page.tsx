import PageTemplete from "@scspace-client/Components/pages/layouts/PageTemplete";
import UserReservation from "@scspace-client/Components/organisms/UserRevervation/UserReservation";

export default function SpacePage() {
  return (
    <PageTemplete
      title={["마이페이지", "예약 목록"]}
      subtitle={["Mypage", "Reservation List"]}
    >
      <UserReservation />
    </PageTemplete>
  );
}