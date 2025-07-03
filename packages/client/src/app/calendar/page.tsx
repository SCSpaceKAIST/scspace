import SpaceCalendar from "@scspace-client/Components/organisms/Calendar/SpaceCalendar";
import PageTemplete from "@scspace-client/Components/templates/PageTemplete";

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
