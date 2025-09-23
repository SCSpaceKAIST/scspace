import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import ManagePerformanceLottery from "@scspace-client/Components/pages/Administration/Lottery/Performance";

export default function PerformanceLotteryAdminPage() {
    return (
        <PageTemplete
            title={["운영", "공연집중기간 추첨 관리"]}
            subtitle={["Administration", "Performance Lottery Management"]}
        >
            <ManagePerformanceLottery />
        </PageTemplete>
    );
}
