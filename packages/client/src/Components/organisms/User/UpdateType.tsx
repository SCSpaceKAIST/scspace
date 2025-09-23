"use client"

import { HStack, RadioGroup, StackSeparator, Switch, Text, VStack } from "@chakra-ui/react";
import { useUserAPI } from "@scspace-client/Hooks/user";
import { UserAuthBinaryEnum } from "@scspace-depot/enums/user.enum";
import { UserUtils } from "@scspace-depot/utils/user.utils";

export default function UpdateType({ uid, onChange, type }: {
    onChange: () => any;
    uid: number;
    type: number;
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

    const handleMemberTypeUpdate = (value: "user" | "manager" | "admin") => {
        let newType = type;
        switch (value) {
            case "admin":
                newType |= UserAuthBinaryEnum.ADMIN | UserAuthBinaryEnum.MANAGER | UserAuthBinaryEnum.USER;
                break;
            case "manager":
                newType |= UserAuthBinaryEnum.MANAGER | UserAuthBinaryEnum.USER;
                newType &= ~UserAuthBinaryEnum.ADMIN;
                break;
            case "user":
                newType |= UserAuthBinaryEnum.USER;
                newType &= ~(UserAuthBinaryEnum.MANAGER | UserAuthBinaryEnum.ADMIN);
                break;
        }
        if (newType !== type) update(newType);
    };

    return (
        <VStack>
            <Text>
                아래 버튼을 클릭하여 유저 타입을 조정할 수 있습니다.
            </Text>
            <HStack gap={8} separator={<StackSeparator />}>
                <RadioGroup.Root
                    value={
                        UserUtils.isAdmin(type) ? "admin" :
                            UserUtils.isManager(type) ? "manager" : "user"
                    }
                    onValueChange={(e) => {
                        handleMemberTypeUpdate(e.value as "user" | "manager" | "admin");
                    }}
                >
                    <HStack gap={4}>
                        <RadioGroup.Item value={"user"}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                                일반
                            </RadioGroup.ItemText>
                        </RadioGroup.Item>
                        <RadioGroup.Item value={"manager"} colorPalette={"green"}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                                공간위원
                            </RadioGroup.ItemText>
                        </RadioGroup.Item>
                        <RadioGroup.Item value={"admin"} colorPalette={"blue"}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                                임원진/개발국
                            </RadioGroup.ItemText>
                        </RadioGroup.Item>
                    </HStack>
                </RadioGroup.Root>
                <Switch.Root
                    colorPalette={"green"}
                    checked={UserUtils.isWorker(type)}
                    onCheckedChange={(e) => {
                        let newType = type;
                        if (e.checked) {
                            newType |= UserAuthBinaryEnum.WORKER;
                        } else {
                            newType &= ~UserAuthBinaryEnum.WORKER;
                        }
                        if (newType !== type) update(newType);
                    }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>
                        근로
                    </Switch.Label>
                </Switch.Root>
                <Switch.Root
                    colorPalette={"blue"}
                    checked={UserUtils.isPasspinMaster(type)}
                    onCheckedChange={(e) => {
                        let newType = type;
                        if (e.checked) {
                            newType |= UserAuthBinaryEnum.PASSPIN_MASTER;
                        } else {
                            newType &= ~UserAuthBinaryEnum.PASSPIN_MASTER;
                        }
                        if (newType !== type) update(newType);
                    }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>
                        비밀번호 관리
                    </Switch.Label>
                </Switch.Root>
            </HStack>
        </VStack>
    );
}