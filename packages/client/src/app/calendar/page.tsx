import PageHeader from "@scspace-client/Components/_commons/PageHeader";
import Calendar from "@scspace-client/Components/Calendar/Calendar";

export default function SpacePage() {
  return (
    <div>
      <PageHeader link_to_prop={"/space"} page_name={"공간"} sub_name="Space" />
      <Calendar />
    </div>
  );
}
