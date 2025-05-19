import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";
import Organization from "@scspace-client/Components/Organization/Organization";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["마이페이지", "단체 관리"]}
            subtitle={["Mypage", "Organization"]}
        >
            <Organization />
        </PageTemplete>
    );
}