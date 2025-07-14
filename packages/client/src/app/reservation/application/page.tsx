import Application from "@scspace-client/Components/pages/Reservation/Application";
import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";

export default function SpacePage() {
  return (
    <PageTemplete
      title={["예약", "신청하기"]}
      subtitle={["Reservation", "Application"]}
    >
      <Application />
    </PageTemplete>
  );
}
