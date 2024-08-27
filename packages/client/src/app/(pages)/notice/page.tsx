import Notice from "@Components/Notice/Notice";
import PageHeader from "@Components/PageHeader";
export default function NoticePage() {
  return (
    <div>
      <PageHeader
        link_to_prop={"/notice"}
        page_name={"공지사항"}
        sub_name="Notice"
      />
      <Notice />
    </div>
  );
}
