"use client"

import { Dialog, Portal, HStack, useBreakpointValue, DataList, Separator, Text, Button, Center, VStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import LoadingComponent from "@scspace-client/Components/templates/Loading";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";
import { IUser } from "@scspace-depot/types/user";
import { useUserAPI } from "@scspace-client/Hooks/user";

export default function UserDialog({ open, setOpen, user, refetch }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    user: IUser | null;
    refetch: () => any;
}) {
    const isWide = useBreakpointValue({ base: false, md: true });

    const { updateUserType } = useUserAPI({ uid: user?.id ?? 0 });

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            size={isWide ? "cover" : "full"}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content className={isWide ? "" : "full"}>
                        {user ? (
                            <>
                                <Dialog.Header>
                                    <Dialog.Title whiteSpace="nowrap">
                                        {user.nameKr}
                                    </Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <DataList.Root orientation="horizontal" width="100%">
                                        <DataList.Item gap={0}>
                                            <DataList.ItemLabel>
                                                Eng Name
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0}>
                                                {user.nameEn}
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item gap={0}>
                                            <DataList.ItemLabel>
                                                Email
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0}>
                                                {user.email}
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                        <Separator />
                                        <DataList.Item gap={0}>
                                            <DataList.ItemLabel>
                                                Update Type
                                            </DataList.ItemLabel>
                                            <DataList.ItemValue margin={0}>
                                                <HStack>
                                                    <Button onClick={() => updateUserType({ type: UserTypeEnum.USER })}>
                                                        User
                                                    </Button>
                                                    <Button onClick={() => updateUserType({ type: UserTypeEnum.WORKER })}>
                                                        Worker
                                                    </Button>
                                                    <Button onClick={() => updateUserType({ type: UserTypeEnum.MANAGER })}>
                                                        Manager
                                                    </Button>
                                                    <Button onClick={() => updateUserType({ type: UserTypeEnum.ADMIN })}>
                                                        Admin
                                                    </Button>
                                                </HStack>
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                    </DataList.Root>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant="outline" rounded="sm">
                                            Close
                                        </Button>
                                    </Dialog.ActionTrigger>
                                </Dialog.Footer>
                            </>
                        ) : (
                            <Center margin={8}>
                                <LoadingComponent />
                            </Center>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    );
}