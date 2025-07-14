import ResStatus from "@scspace-client/Components/pages/Reservation/Status";
import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";

export default function SpacePage() {
  return (
    <PageTemplete
      title={["예약", "현황"]}
      subtitle={["Reservation", "Status"]}
    >
      <ResStatus />
    </PageTemplete>
  );
}
