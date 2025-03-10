import Introduction from "@scspace-client/Components/Introduction/Introduction";
import PageHeader from "@scspace-client/Components/_commons/PageHeader";

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
