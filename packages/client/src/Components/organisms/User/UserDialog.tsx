"use client"

import { Dialog, DataList, Separator, Button, Center } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { IUser } from "@scspace-depot/types/user";
import { useUserAPI } from "@scspace-client/Hooks/user";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import UpdateType from "./UpdateType";
import { useOrganization } from "@scspace-client/Hooks/organization";
import OrganizationTable from "../Organization/OrganizationTable";

export default function UserDialog({ open, setOpen, user, refetchList }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    user: IUser | null;
    refetchList: () => any;
}) {
    const { getUserTypeCode } = useUserAPI({ uid: user?.id ?? 0 });
    const { organization, refetch: refetchOrg } = useOrganization({ uid: user?.id ?? 0 });

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
                    <Separator />
                    <Dialog.Body>
                        <UpdateType uid={user.id} onChange={refetchList} />
                        <Separator my={4} />
                        <DataList.Root orientation="horizontal" width="100%">
                            <DataListItem label="Eng Name">
                                {user.nameEn}
                            </DataListItem>
                            <DataListItem label="Student Number">
                                {user.studentNumber}
                            </DataListItem>
                            <DataListItem label="Email">
                                {user.email}
                            </DataListItem>
                            <DataListItem label="Type">
                                {getUserTypeCode(user.type)}
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Organization">
                                {organization ? (
                                    <OrganizationTable
                                        organization={organization}
                                        refetch={refetchOrg}
                                        uid={user?.id ?? 0}
                                    />
                                ) : (
                                    <LoadingComponent />
                                )}
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