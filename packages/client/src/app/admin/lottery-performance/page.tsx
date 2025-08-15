import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import ManagePerformanceLottery from "@scspace-client/Components/pages/Administration/Lottery/Performance";

export default function PerformanceLotteryAdminPage() {
    return (
        <PageTemplete
            title="공연집중기간 추첨 관리"
            subtitle="Performance Intensive Period Lottery Management"
        >
            <ManagePerformanceLottery />
        </PageTemplete>
    );
}
