import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import LotteryManagement from "@scspace-client/Components/pages/Administration/Lottery";

export default function LotteryPage() {
    return (
        <PageTemplete
            title="추첨 관리"
            subtitle="Lottery Management"
        >
            <LotteryManagement />
        </PageTemplete>
    );
}
