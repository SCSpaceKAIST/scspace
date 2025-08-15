import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import PerformanceLottery from "@scspace-client/Components/pages/Lottery/Performance";
import React from "react";

export default function LotteryPerformancePage() {
    return (
        <PageTemplete
            title="공연집중기간 추첨"
            subtitle="Performance Intensive Period Lottery"
        >
            <PerformanceLottery />
        </PageTemplete>
    );
}
