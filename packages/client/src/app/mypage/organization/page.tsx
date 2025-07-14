import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";
import Organization from "@scspace-client/Components/pages/Mypage/Organization";

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