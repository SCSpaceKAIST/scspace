import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import RentalApplication from "@scspace-client/Components/pages/Rental/Application";

export default function SpacePage() {
  return (
    <PageTemplete
      title={["대여", "신청하기"]}
      subtitle={["Rental", "Application"]}
    >
      <RentalApplication />
    </PageTemplete>
  );
}
