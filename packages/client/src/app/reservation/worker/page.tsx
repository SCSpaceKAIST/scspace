import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import WorkerReservation from "@scspace-client/Components/pages/Reservation/Worker";

export default function SpacePage() {
  return (
    <PageTemplete
      title={["예약", "근로 필요"]}
      subtitle={["Reservation", "Worker Needs"]}
    >
      <WorkerReservation />
    </PageTemplete>
  );
}