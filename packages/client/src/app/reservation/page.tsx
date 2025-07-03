import Reservation from "@scspace-client/Components/templates/Reservation";
import PageTemplete from "@scspace-client/Components/atoms/PageTemplete";

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
