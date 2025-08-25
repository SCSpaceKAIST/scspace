import ReservationApplication from "@scspace-client/Components/pages/Reservation/Application";
import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";

export default function SpacePage() {
  return (
    <PageTemplete
      title={["예약", "신청하기"]}
      subtitle={["Reservation", "Application"]}
    >
      <ReservationApplication />
    </PageTemplete>
  );
}
