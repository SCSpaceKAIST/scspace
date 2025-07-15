"use client"

import Scroll from "../../Layout/Scroll";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useOrganization, } from "@scspace-client/Hooks/organization";
import LoadingComponent from "../../../atoms/Loading";

import OrganizationTable from "@scspace-client/Components/organisms/Organization/OrganizationTable";

export default function Organization() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const { organization, refetch } = useOrganization({ uid: userInfo?.id });

    return (
        <Scroll>
            {organization ? (
                <OrganizationTable
                    organization={organization}
                    refetch={refetch}
                />
            ) : (
                <LoadingComponent />
            )}
        </Scroll >
    );
}