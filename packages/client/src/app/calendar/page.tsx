import SpaceCalendar from "@scspace-client/Components/Calendar/SpaceCalendar";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";

export default function SpacePage() {
  return (
    <PageTemplete
      title="예약 확인하기"
      subtitle="Reservation Calendar"
    >
      <SpaceCalendar />
    </PageTemplete>
  );
}
