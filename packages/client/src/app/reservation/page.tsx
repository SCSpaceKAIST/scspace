import Reservation from "@scspace-client/Components/Reservation/Reservation";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";

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
