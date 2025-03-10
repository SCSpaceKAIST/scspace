import Ask from "@scspace-client/Components/Ask/Ask";
import PageHeader from "@scspace-client/Components/_commons/PageHeader";

export default function AskPage() {
  return (
    <div>
      <PageHeader
        link_to_prop={"/ask"}
        page_name={"문의사항"}
        sub_name={"Ask"}
      />
      <Ask />
    </div>
  );
}
