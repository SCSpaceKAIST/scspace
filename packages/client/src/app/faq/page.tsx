// src/app/about/page.tsx

import Faq from "@Components/FAQ/Faq";
import PageHeader from "../Components/PageHeader";
export default function FaqPage() {
  return (
    <div>
      <PageHeader link_to_prop={"/Faq"} page_name={"FAQ"} />
      <Faq />
    </div>
  );
}
