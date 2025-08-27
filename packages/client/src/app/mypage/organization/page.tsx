import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import UserOrganization from "@scspace-client/Components/pages/Mypage/UserOrganization";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["마이페이지", "조직 관리"]}
            subtitle={["Mypage", "Organization"]}
        >
            <UserOrganization />
        </PageTemplete>
    );
}