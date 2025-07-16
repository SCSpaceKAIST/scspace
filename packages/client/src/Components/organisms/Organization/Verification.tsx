"use client"

import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";

export default function Verification({ oid, status }: {
    oid: number;
    status: OrganizationStatusEnum
}) {
    const { updateStatus } = useOrganizationAPI({ id: oid }).status;

    return (
        <VStack>
            {status === OrganizationStatusEnum.REGISTER_REQUEST && (
                <Text fontSize="lg">
                    등록 대기중인 조직입니다.
                </Text>
            )}
            {status === OrganizationStatusEnum.VERIFY_REQUEST && (
                <Text fontSize="lg">
                    인증 대기중인 조직입니다.
                </Text>
            )}
            <Text>
                아래 버튼을 클릭하여 조직 권한을 조정할 수 있습니다.
            </Text>
            <HStack>
                <Button colorPalette="blue" onClick={() => updateStatus(
                    OrganizationStatusEnum.REJECTED, {
                    onSuccess: () => {
                        alert("조직이 반려되었습니다.");
                    }
                })}>
                    반려
                </Button>
                <Button colorPalette="green" onClick={() => updateStatus(
                    OrganizationStatusEnum.REGISTERED, {
                    onSuccess: () => {
                        alert("조직 등록이 승인되었습니다.");
                    }
                })}>
                    승인
                </Button>
                <Button colorPalette="red" onClick={() => updateStatus(
                    OrganizationStatusEnum.VERIFIED, {
                    onSuccess: () => {
                        alert("조직이 성공적으로 인증되었습니다");
                    }
                })}>
                    인증
                </Button>
            </HStack>
        </VStack>
    );
}