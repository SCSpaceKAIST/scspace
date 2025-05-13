import PageHeader from "@scspace-client/Components/_commons/PageHeader";
import Reservation from "@scspace-client/Components/Reservation/Reservation";

export default function SpacePage() {
  return (
    <div>
      <PageHeader
        link_to_prop={"/reservation"}
        page_name={"예약"}
        sub_name="Reservation"
      />
      <Reservation />
    </div>
  );
}
