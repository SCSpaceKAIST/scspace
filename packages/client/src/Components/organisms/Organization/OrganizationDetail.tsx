"use client"

import {
    Button,
    Dialog,
    Separator,
    IconButton,
    DataList,
    HStack,
    Text,
    Stack,
    useBreakpointValue
} from "@chakra-ui/react";
import { useOrganizationAPI, useOrganizationDetail } from "@scspace-client/Hooks/organization";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { HiOutlineRefresh } from "react-icons/hi";

import AddMemberBtn from "./AddMemberBtn";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useEffect, useState } from "react";
import { useDate } from "@scspace-client/Hooks/utils";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";

export default function OrganizationDetail({ id, onDelete }: {
    id: number;
    onDelete: () => any;
}) {
    const { organizationDetail, refetch } = useOrganizationDetail({ id: id });
    const { userInfo, needLogin } = useAuth();
    const [isDelegator, setIsDelegator] = useState<boolean>(false);
    const { getString } = useDate();

    useEffect(() => {
        setIsDelegator((userInfo?.id ?? -1) === (organizationDetail?.delegatorId ?? -2));
    }, [userInfo, organizationDetail]);

    useEffect(() => { needLogin() }, []);

    const isWide = useBreakpointValue({ base: false, md: true });

    const { deleteOrg } = useOrganizationAPI({ id });
    function deleteAction() {
        deleteOrg({}, {
            onSuccess: () => {
                onDelete();
            }
        })
    }

    return (organizationDetail ? (
        <>
            <Dialog.Header>
                <HStack width="100%" justify="space-between" alignItems="start">
                    <HStack>
                        <IconButton rounded="sm" variant="ghost" onClick={() => refetch()} size="sm">
                            <HiOutlineRefresh color="gray" />
                        </IconButton>
                        <Stack gap={0}>
                            <Text color="fg.muted">
                                Organization Name
                            </Text>
                            <Dialog.Title>
                                {organizationDetail.name}
                            </Dialog.Title>
                        </Stack>
                    </HStack>
                    <DataList.Root
                        orientation={isWide ? "horizontal" : "vertical"}
                        gap={1} color="fg.muted"
                    >
                        {isWide && (
                            <DataListItem label="Create Time">
                                {getString(organizationDetail.timeRegister)}
                            </DataListItem>
                        )}
                        <DataListItem label="Update Time">
                            {getString(organizationDetail.timeUpdate)}
                        </DataListItem>
                    </DataList.Root>
                </HStack>
            </Dialog.Header>
            <Separator />
            <Dialog.Body px={8} py={4}>
                <DataList.Root orientation={isWide ? "horizontal" : "vertical"}>
                    <DataListItem label="Delegator">
                        <DataList.Root>
                            <DataListItem label="Name">
                                {organizationDetail.delegator.nameKr}
                            </DataListItem>
                            <DataListItem label="Email">
                                {organizationDetail.delegator.email}
                            </DataListItem>
                        </DataList.Root>
                    </DataListItem>
                    <Separator />
                    <DataListItem label={
                        <HStack gap={2}>
                            <Text margin={0} padding={0}>
                                Members
                            </Text>
                            {isWide && (
                                <AddMemberBtn
                                    oid={organizationDetail.id}
                                    refetch={refetch}
                                    disabled={!isDelegator}
                                />
                            )}
                        </HStack>
                    }>
                        <SimpleTable
                            header={[
                                "StudentNumber",
                                "Name (Kor)",
                                "Name (Eng)",
                                "email"
                            ]}
                            content={organizationDetail.members.map((u) => ({
                                id: u.id,
                                row: [
                                    u.user.studentNumber,
                                    u.user.nameKr,
                                    u.user.nameEn,
                                    u.user.email
                                ],
                            }))}
                        />
                    </DataListItem>
                </DataList.Root>
            </Dialog.Body >
            <Separator />
            <Dialog.Footer>
                {(isDelegator) && (
                    <DeleteBtn
                        onDelete={deleteAction}
                    />
                )}
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline" rounded="sm">
                        Close
                    </Button>
                </Dialog.ActionTrigger>
            </Dialog.Footer>
        </>
    ) : (
        <LoadingComponent />
    ));
}