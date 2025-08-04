"use client"

import PageSelector, { IPage } from "@scspace-client/Components/molecules/page/PageSelector";
import Application from "./Application";
import ResStatus from "./Status";
import UserReservation from "../Mypage/UserReservation";
import { useAuth } from "@scspace-client/Hooks/auth";

export default function Reservation() {
    const { isLogined } = useAuth();

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
            preview: (<Application />),
            href: "/reservation/application",
            invisible: !isLogined
        },
        {
            kor: "내 예약",
            eng: "My Organization",
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
