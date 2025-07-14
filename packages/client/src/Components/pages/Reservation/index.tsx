"use client"

import PageSelector, { IPage } from "@scspace-client/Components/pages/Layout/PageSelector";
import Application from "./Application";
import ResStatus from "./Status";

export default function Reservation() {
    const pages: IPage[] = [
        {
            kor: "신청",
            eng: "Application",
            preview: (<Application />),
            href: "/reservation/apply"
        },
        {
            kor: "현황",
            eng: "Status",
            preview: (<ResStatus />),
            href: "/reservation/status"
        },
    ];

    return (
        <PageSelector
            pages={pages}
        />
    );
}
