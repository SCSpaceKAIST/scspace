"use client"

import PageSelector, { IPage } from "@scspace-client/Components/molecules/page/PageSelector";
import UserOrganization from "../Mypage/UserOrganization";
import VerifiedOrganization from "./Verified";
import { useAuth } from "@scspace-client/Hooks/auth";

export default function Organization() {
    const { isLogined } = useAuth();

    const pages: IPage[] = [
        {
            kor: "인증된 조직",
            eng: "Verified Organization",
            href: "/organization/verified",
            preview: (<VerifiedOrganization />)
        },
        {
            kor: "내 조직",
            eng: "My Organization",
            href: "/mypage/organization",
            preview: (<UserOrganization />),
            invisible: !isLogined
        }
    ];

    return (
        <PageSelector
            pages={pages.filter(p => !p.invisible)}
        />
    );
}
