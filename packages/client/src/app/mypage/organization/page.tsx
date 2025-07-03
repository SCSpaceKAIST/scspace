import PageTemplete from "@scspace-client/Components/atoms/PageTemplete";
import Organization from "@scspace-client/Components/templates/Organization";

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