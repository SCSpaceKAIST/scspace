import { HStack } from "@chakra-ui/react";
import { Verified, VerifyRequested } from "@scspace-client/Components/molecules/veritication/VerifiedMark";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";

export default function OrganizationName({ status, children }: {
    status: OrganizationStatusEnum;
    children: React.ReactNode;
}) {
    return (
        <HStack m={0} p={0} alignContent="center" alignItems="center" gap={1}>
            {status === OrganizationStatusEnum.VERIFY_REQUEST && <VerifyRequested />}
            {status === OrganizationStatusEnum.VERIFIED && <Verified />}
            {children}
        </HStack>
    );
}