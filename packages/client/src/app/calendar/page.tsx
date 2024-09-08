import Space from "@/Components/Space/Space";
import PageHeader from "@/Components/_commons/PageHeader";

export default function SpacePage() {
  return (
    <div>
      <PageHeader link_to_prop={"/space"} page_name={"공간"} sub_name="Space" />
      <Space />
    </div>
  );
}
