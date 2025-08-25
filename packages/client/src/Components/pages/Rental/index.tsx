import React from "react";
import PageSelector, { IPage } from "../../molecules/page/PageSelector";
import RentalApplication from "./Application";

export default function Rental() {
    const pages: IPage[] = [
        {
            href: "/rental/application",
            kor: "신청",
            eng: "Application",
            preview: (<RentalApplication />)
        },
        {
            href: "/manage/rental",
            kor: "내 대여",
            eng: "My Rentals",
            preview: (<>내 대여</>)
        }
    ]

    return (
        <PageSelector
            pages={pages}
        />
    );
}