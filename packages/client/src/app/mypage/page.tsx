import ReservationList from "@/Components/Reservation/ReservationList";
import Space from "@/Components/Space/Space";
import PageHeader from "@/Components/_commons/PageHeader";

export default function SpacePage() {
  return (
    <div>
      <PageHeader
        link_to_prop={"/mypage"}
        page_name={"마이페이지"}
        sub_name="Mypage"
      />
      <ReservationList />
    </div>
  );
}
