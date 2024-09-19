import PageHeader from "@/Components/_commons/PageHeader";
import Calendar from "@/Components/Calendar/Calendar";

export default function SpacePage() {
  return (
    <div>
      <PageHeader link_to_prop={"/space"} page_name={"공간"} sub_name="Space" />
      <Calendar />
    </div>
  );
}
