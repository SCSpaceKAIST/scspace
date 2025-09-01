import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import WorkHistory from "@scspace-client/Components/pages/Mypage/WorkHistory";

export default function SpacePage() {
  return (
    <PageTemplete
      title={["마이페이지", "근로 기록"]}
      subtitle={["Mypage", "Work History"]}
    >
      <WorkHistory />
    </PageTemplete>
  );
}