import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";
import Organization from "@scspace-client/Components/pages/Organization";

export default function SpacePage() {
  return (
    <PageTemplete
      title="조직"
      subtitle="Organization"
    >
      <Organization />
    </PageTemplete>
  );
}
