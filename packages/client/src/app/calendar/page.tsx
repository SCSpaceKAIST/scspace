import SpaceCalendar from "@scspace-client/Components/pages/SpaceCalendar";
import PageTemplete from "@scspace-client/Components/pages/layouts/PageTemplete";

export default function SpacePage() {
  return (
    <PageTemplete
      title="예약 현황"
      subtitle="Reservation Calendar"
    >
      <SpaceCalendar />
    </PageTemplete>
  );
}
