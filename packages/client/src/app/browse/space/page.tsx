import Space from "@scspace-client/Components/pages/Browse/Spaces";
import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";

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
