import Faq from "@scspace-client/Components/FAQ/Faq";
import PageHeader from "@scspace-client/Components/_commons/PageHeader";
export default function FaqPage() {
  return (
    <div>
      <PageHeader link_to_prop="/faq" page_name="FAQ" sub_name="faq" />
      <Faq />
    </div>
  );
}
