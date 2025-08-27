import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import UserRental from "@scspace-client/Components/pages/Mypage/UserRental";

export default function SpacePage() {
  return (
    <PageTemplete
      title={["마이페이지", "대여 목록"]}
      subtitle={["Mypage", "Rental List"]}
    >
      <UserRental />
    </PageTemplete>
  );
}