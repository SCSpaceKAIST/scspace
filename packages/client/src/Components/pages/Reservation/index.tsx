import PageSelector, { IPage } from "@scspace-client/Components/molecules/page/PageSelector";
import Application from "./Application";
import ResStatus from "./Status";
import UserReservation from "../Mypage/UserReservation";

export default function Reservation() {
    const pages: IPage[] = [
        {
            kor: "신청",
            eng: "Application",
            preview: (<Application />),
            href: "/reservation/application"
        },
        {
            kor: "현황",
            eng: "Status",
            preview: (<ResStatus />),
            href: "/reservation/status"
        },
        {
            kor: "내 예약",
            eng: "My Organization",
            preview: (<UserReservation />),
            href: "/mypage/reservation"
        }
    ];

    return (
        <PageSelector
            pages={pages}
        />
    );
}
