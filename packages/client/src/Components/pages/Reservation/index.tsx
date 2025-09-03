"use client"

import PageSelector, { IPage } from "@scspace-client/Components/molecules/page/PageSelector";
import ReservationApplication from "./Application";
import ResStatus from "./Status";
import UserReservation from "../Mypage/UserReservation";
import { useAuth } from "@scspace-client/Hooks/auth";
import WorkerReservation from "@scspace-client/Components/pages/Reservation/Worker";

export default function Reservation() {
    const { isLogined, isWorker } = useAuth();

    const pages: IPage[] = [
        {
            kor: "현황",
            eng: "Status",
            preview: (<ResStatus />),
            href: "/reservation/status"
        },
        {
            kor: "신청",
            eng: "Application",
            preview: (<ReservationApplication />),
            href: "/reservation/application",
            invisible: !isLogined
        },
        {
            kor: "근로 신청 예약",
            eng: "Reservation needs Worker",
            preview: (<WorkerReservation />),
            href: "/reservation/worker",
            invisible: !isWorker
        },
        {
            kor: "내 예약",
            eng: "My Reservation",
            preview: (<UserReservation />),
            href: "/mypage/reservation",
            invisible: !isLogined
        }
    ];

    return (
        <PageSelector
            pages={pages.filter(p => !p.invisible)}
        />
    );
}
