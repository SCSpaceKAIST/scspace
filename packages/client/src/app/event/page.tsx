import Event from "@scspace-client/Components/Event/Event";
import PageHeader from "@scspace-client/Components/_commons/PageHeader";
export default function EventPage() {
  return (
    <div>
      <PageHeader link_to_prop="/event" page_name="이벤트" sub_name="Event" />
      <Event />
    </div>
  );
}
