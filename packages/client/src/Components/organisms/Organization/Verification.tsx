"use client"

import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";
import { IOrganizationAll } from "@scspace-depot/types/organization";

export default function Verification({ organization, onChange }: {
    onChange: () => any;
    organization: IOrganizationAll;
}) {
    const { updateStatus, getOrganizationStatusCode } = useOrganizationAPI({ id: organization.id }).status;
    const status = organization.status;

    function update(status: OrganizationStatusEnum) {
        updateStatus({ status }, {
            onSuccess: () => {
                alert(`조직의 상태가 변경되었습니다: ${getOrganizationStatusCode(status)}`);
                onChange();
            }
        })
    }

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
                <Button colorPalette="red" px={2} py={1} onClick={() => update(
                    OrganizationStatusEnum.REJECTED
                )}>
                    반려
                </Button>
                <Button variant="outline" px={2} py={1} colorPalette="green" onClick={() => update(
                    OrganizationStatusEnum.REGISTER_REQUEST
                )}>
                    등록 대기
                </Button>
                <Button colorPalette="green" px={2} py={1} onClick={() => update(
                    OrganizationStatusEnum.REGISTERED
                )}>
                    등록
                </Button>
                <Button variant="outline" px={2} py={1} colorPalette="blue" onClick={() => update(
                    OrganizationStatusEnum.VERIFY_REQUEST
                )}>
                    인증 대기
                </Button>
                <Button colorPalette="blue" px={2} py={1} onClick={() => update(
                    OrganizationStatusEnum.VERIFIED
                )}>
                    인증
                </Button>
            </HStack>
        </VStack>
    );
}