import PageSelector, { IPage } from "@scspace-client/Components/molecules/page/PageSelector";
import UserOrganization from "../Mypage/Organization";
import VerifiedOrganization from "./Verified";

export default function Organization() {

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
            preview: (<UserOrganization />)
        }
    ];

    return (
        <PageSelector
            pages={pages}
        />
    );
}
