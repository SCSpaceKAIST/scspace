"use client"

import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useUserAPI } from "@scspace-client/Hooks/user";
import { UserAuthBinaryEnum, UserTypeEnum } from "@scspace-depot/enums/user.enum";

export default function UpdateType({ uid, onChange }: {
    onChange: () => any;
    uid: number;
}) {
    const { updateUserType, getUserTypeCode } = useUserAPI({ uid });

    function update(type: number) {
        updateUserType({ type }, {
            onSuccess: () => {
                alert(`유저의 타입이 변경되었습니다: ${getUserTypeCode(type)}`);
                onChange();
            }
        })
    }

    return (
        <VStack>
            <Text>
                아래 버튼을 클릭하여 유저 타입을 조정할 수 있습니다.
            </Text>
            <HStack>
                <Button variant="outline" px={2} py={1} height="fit-content" onClick={() => update(
                    UserAuthBinaryEnum.USER
                )}>
                    일반
                </Button>
                <Button variant="outline" px={2} py={1} height="fit-content" colorPalette="green" onClick={() => update(
                    UserAuthBinaryEnum.USER + UserAuthBinaryEnum.WORKER
                )}>
                    근로자
                </Button>
                <Button variant="outline" px={2} py={1} height="fit-content" colorPalette="orange" onClick={() => update(
                    UserAuthBinaryEnum.USER + UserAuthBinaryEnum.MANAGER
                )}>
                    공간위원
                </Button>
                <Button variant="outline" px={2} py={1} height="fit-content" colorPalette="blue" onClick={() => update(
                    UserAuthBinaryEnum.USER + UserAuthBinaryEnum.MANAGER + UserAuthBinaryEnum.ADMIN
                )}>
                    임원진/개발진
                </Button>
            </HStack>
        </VStack>
    );
}