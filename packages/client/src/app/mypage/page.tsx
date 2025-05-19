import Mypage from "@scspace-client/Components/Mypage/Mypage";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";

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