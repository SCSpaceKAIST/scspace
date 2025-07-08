import Reservation from "@scspace-client/Components/pages/Reservation";
import PageTemplete from "@scspace-client/Components/pages/layouts/PageTemplete";

export default function SpacePage() {
  return (
    <PageTemplete
      title="예약"
      subtitle="Reservation"
    >
      <Reservation />
    </PageTemplete>
  );
}
