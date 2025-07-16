"use client"

import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useMailAPI } from "@scspace-client/Hooks/mail";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";
import { IOrganizationAll } from "@scspace-depot/types/organization";

export default function Verification({ organization, onChange }: {
    onChange: () => any;
    organization: IOrganizationAll;
}) {
    const { updateStatus } = useOrganizationAPI({ id: organization.id }).status;
    const { sendMail } = useMailAPI();
    const status = organization.status;

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
                <Button onClick={() => updateStatus(
                    OrganizationStatusEnum.REJECTED, {
                    onSuccess: () => {
                        alert("조직이 반려되었습니다.");
                        onChange();
                    }
                })}>
                    반려
                </Button>
                <Button variant="outline" colorPalette="green" onClick={() => updateStatus(
                    OrganizationStatusEnum.REGISTER_REQUEST, {
                    onSuccess: () => {
                        alert("조직이 승인 대기 상태로 변경되었습니다.");
                        onChange();
                    }
                })}>
                    승인 대기
                </Button>
                <Button colorPalette="green" onClick={() => updateStatus(
                    OrganizationStatusEnum.REGISTERED, {
                    onSuccess: () => {
                        alert("조직 등록이 승인되었습니다.");
                        onChange();
                    }
                })}>
                    승인
                </Button>
                <Button variant="outline" colorPalette="orange" onClick={() => updateStatus(
                    OrganizationStatusEnum.VERIFY_REQUEST, {
                    onSuccess: () => {
                        alert("조직이 인증 대기 상태로 변경되었습니다");
                        onChange();
                    }
                })}>
                    인증 대기
                </Button>
                <Button colorPalette="blue" onClick={() => updateStatus(
                    OrganizationStatusEnum.VERIFIED, {
                    onSuccess: () => {
                        alert("조직이 성공적으로 인증되었습니다");
                        sendMail({
                            to: organization.delegator.email ?? "",
                            subject: "조직 인증 승인 완료 | Organization verification approved",
                            template: "orgVerified",
                            context: {
                                organization: {
                                    name: organization.name
                                }
                            }
                        })
                        onChange();
                    }
                })}>
                    인증
                </Button>
            </HStack>
        </VStack>
    );
}