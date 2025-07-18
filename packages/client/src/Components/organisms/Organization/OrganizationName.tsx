import { HStack } from "@chakra-ui/react";
import { Verified, VerificationRequested, Registered, RegistrationRequested, Rejected } from "@scspace-client/Components/molecules/veritication/VerifiedMark";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";

export default function OrganizationName({ status, children }: {
    status: OrganizationStatusEnum;
    children: React.ReactNode;
}) {
    const mark = {
        [OrganizationStatusEnum.REGISTERED]: (<Registered />),
        [OrganizationStatusEnum.REGISTER_REQUEST]: (<RegistrationRequested />),
        [OrganizationStatusEnum.REJECTED]: (<Rejected />),
        [OrganizationStatusEnum.VERIFIED]: (<Verified />),
        [OrganizationStatusEnum.VERIFY_REQUEST]: (<VerificationRequested />)
    }

    return (
        <HStack m={0} p={0} alignContent="center" alignItems="center" gap={1}>
            {mark[status]}
            {children}
        </HStack>
    );
}