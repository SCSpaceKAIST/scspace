import PageTemplete from "@scspace-client/Components/templates/PageTemplete";
import Organization from "@scspace-client/Components/pages/Organization";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["마이페이지", "조직 관리"]}
            subtitle={["Mypage", "Organization"]}
        >
            <Organization />
        </PageTemplete>
    );
}