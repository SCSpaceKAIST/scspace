import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import SeminarLottery from "@scspace-client/Components/pages/Lottery/Seminar";
import React from "react";

export default function LotterySeminarPage() {
    return (
        <PageTemplete
            title="세미나실 정기예약 추첨"
            subtitle="Seminar Room Regular Reservation Lottery"
        >
            <SeminarLottery />
        </PageTemplete>
    );
}
