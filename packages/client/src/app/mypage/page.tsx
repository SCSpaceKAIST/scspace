import Mypage from "@scspace-client/Components/templates/Mypage";
import PageTemplete from "@scspace-client/Components/atoms/PageTemplete";

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