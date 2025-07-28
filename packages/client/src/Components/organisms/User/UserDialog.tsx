"use client"

import { Dialog, Portal, Wrap, useBreakpointValue, DataList, Separator, Text, Button, Center, VStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";
import { IUser } from "@scspace-depot/types/user";
import { useUserAPI } from "@scspace-client/Hooks/user";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import UpdateType from "./UpdateType";

export default function UserDialog({ open, setOpen, user, refetch }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    user: IUser | null;
    refetch: () => any;
}) {
    const { getUserTypeCode } = useUserAPI({ uid: user?.id ?? 0 });

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpen}
        >
            {user ? (
                <>
                    <Dialog.Header>
                        <Dialog.Title whiteSpace="nowrap">
                            {user.nameKr}
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <UpdateType uid={user.id} onChange={refetch} />
                        <Separator my={4} />
                        <DataList.Root orientation="horizontal" width="100%">
                            <DataListItem label="Eng Name">
                                {user.nameEn}
                            </DataListItem>
                            <DataListItem label="Email">
                                {user.email}
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Type">
                                {getUserTypeCode(user.type)}
                            </DataListItem>
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
        </SimpleDialog>
    );
}