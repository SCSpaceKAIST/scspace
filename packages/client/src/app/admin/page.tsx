import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import Administration from "@scspace-client/Components/pages/Administration";

export default function SpacePage() {
  return (
    <PageTemplete
      title="운영"
      subtitle="Administration"
    >
      <Administration />
    </PageTemplete>
  );
}
