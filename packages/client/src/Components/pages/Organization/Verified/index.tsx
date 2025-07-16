"use client"

import Scroll from "../../Layout/Scroll";
import { useVerifiedOrganization, } from "@scspace-client/Hooks/organization";
import LoadingComponent from "../../../atoms/Loading";

import OrganizationTable from "@scspace-client/Components/organisms/Organization/OrganizationTable";
import { useAuth } from "@scspace-client/Hooks/auth";

export default function VerifiedOrganization() {
    const { needLogin } = useAuth();
    needLogin();

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