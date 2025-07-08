import Mypage from "@scspace-client/Components/pages/Mypage";
import PageTemplete from "@scspace-client/Components/pages/layouts/PageTemplete";

export default function SpacePage() {
  return (
    <PageTemplete
      title="마이페이지"
      subtitle="Mypage"
    >
      <Mypage />
    </PageTemplete>
  );
}