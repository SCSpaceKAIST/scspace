"use client"

import { useOrganizationAPI } from "@scspace-client/Hooks/organization";

import OrganizationTable from "@scspace-client/Components/organisms/Organization/OrganizationTable";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";

export default function VerifiedOrganization() {
    const { data: organization, refetch } = useOrganizationAPI().verifiedOrganizations;

    return (
        <Scroll>
            {organization ? (
                <OrganizationTable
                    organization={organization}
                    refetch={refetch}
                    helperText="The list of verified organizations."
                    disabled
                />
            ) : (
                <LoadingComponent />
            )}
        </Scroll >
    );
}