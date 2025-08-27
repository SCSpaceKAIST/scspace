import React from "react";
import PageSelector, { IPage } from "../../molecules/page/PageSelector";
import RentalApplication from "./Application";
import UserRental from "../Mypage/UserRental";

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
            preview: (<UserRental />)
        }
    ]

    return (
        <PageSelector
            pages={pages}
        />
    );
}