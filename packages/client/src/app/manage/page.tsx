import Management from "@scspace-client/Components/pages/Management";
import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";

export default function SpacePage() {
  return (
    <PageTemplete
      title="관리"
      subtitle="Management"
    >
      <Management />
    </PageTemplete>
  );
}
