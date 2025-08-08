"use client"

import { useAuth } from "@scspace-client/Hooks/auth";
import { useOrganizationAPI, } from "@scspace-client/Hooks/organization";

import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import OrganizationTable from "@scspace-client/Components/organisms/Organization/OrganizationTable";

export default function ManageOrganization() {
    const { needManager } = useAuth();
    needManager();

    const { data: organization, refetch } = useOrganizationAPI().allOrganizations;

    return (
        <Scroll>
            {organization ? (
                <OrganizationTable
                    organization={organization}
                    refetch={refetch}
                    showTabs
                />
            ) : (
                <LoadingComponent />
            )}
        </Scroll >
    );
}