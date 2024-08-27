import Introduction from "@/Components/Introduction/Introduction";
import PageHeader from "@Components/PageHeader";

export default function IntroPage() {
  return (
    <div>
      <PageHeader
        link_to_prop="/introduction"
        page_name="소개"
        sub_name="Introduction"
      />
      <Introduction />
    </div>
  );
}
