import Space from "@scspace-client/Components/pages/Browse/Space";
import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";

export default function SpacePage() {
  return (
    <PageTemplete
      title={["찾아보기", "공간"]}
      subtitle={["Browse", "Space"]}
    >
      <Space />
    </PageTemplete>
  );
}
