"use client"

import Scroll from "../../../molecules/page/Scroll";
import { useVerifiedOrganization, } from "@scspace-client/Hooks/organization";
import LoadingComponent from "../../../atoms/Loading";

import OrganizationTable from "@scspace-client/Components/organisms/Organization/OrganizationTable";

export default function VerifiedOrganization() {
    const { organization, refetch } = useVerifiedOrganization();

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