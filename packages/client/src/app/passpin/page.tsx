import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import PasspinPage from "@scspace-client/Components/pages/Passpin";

export default function SpacePage() {
    return (
        <PageTemplete
            title="비밀번호 관리"
            subtitle="Passpin Management"
        >
            <PasspinPage />
        </PageTemplete>
    );
}