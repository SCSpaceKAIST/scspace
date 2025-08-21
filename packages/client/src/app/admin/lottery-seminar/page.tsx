import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import ManageSeminarLottery from "@scspace-client/Components/pages/Administration/Lottery/Seminar";

export default function LotteryPage() {
    return (
        <PageTemplete
            title="세미나실 정기예약 추첨 관리"
            subtitle="Seminar-room Lottery Management"
        >
            <ManageSeminarLottery />
        </PageTemplete>
    );
}
