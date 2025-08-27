"use client"

import { useAuth } from "@scspace-client/Hooks/auth";
import { useOrganizationAPI, } from "@scspace-client/Hooks/organization";

import OrganizationTable from "@scspace-client/Components/organisms/Organization/OrganizationTable";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";

export default function UserOrganization() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const { data: organization, refetch } = useOrganizationAPI({ uid: userInfo?.id }).userOrganizations;

    return (
        <Scroll>
            {organization ? (
                <OrganizationTable
                    organization={organization}
                    refetch={refetch}
                    uid={userInfo?.id ?? 0}
                    showTabs
                />
            ) : (
                <LoadingComponent />
            )}
        </Scroll >
    );
}