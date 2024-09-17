import PageHeader from "@/Components/_commons/PageHeader";
import Reservation from "@/Components/Reservation/Reservation";

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
