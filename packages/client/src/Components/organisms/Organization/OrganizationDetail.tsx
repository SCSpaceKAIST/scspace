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
    useBreakpointValue,
    VStack
} from "@chakra-ui/react";
import { useOrganizationAPI, useOrganizationDetail } from "@scspace-client/Hooks/organization";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { HiOutlineRefresh } from "react-icons/hi";

import AddMemberBtn from "./AddMemberBtn";
import { useAuth } from "@scspace-client/Hooks/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDate } from "@scspace-client/Hooks/utils";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";
import RequestVerifyBtn from "./RequestVerifyBtn";
import OrganizationName from "./OrganizationName";
import Verification from "./Verification";
import EditNameBtn from "./EditNameBtn";

export default function OrganizationDialog({ open, setOpen, id, onChange }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: number;
    onChange: () => any;
}) {
    const { organizationDetail, refetch } = useOrganizationDetail({ id: id });
    const { userInfo, needLogin, isManager } = useAuth();
    const [isDelegator, setIsDelegator] = useState<boolean>(false);
    const { getString } = useDate();

    useEffect(() => {
        setIsDelegator((userInfo?.id ?? -1) === (organizationDetail?.delegatorId ?? -2));
    }, [userInfo, organizationDetail]);

    useEffect(() => { needLogin() }, []);

    const isWide = useBreakpointValue({ base: false, md: true });

    const { deleteOrg, status } = useOrganizationAPI({ id });
    const getOrgStatusCode = status.getOrganizationStatusCode;

    function deleteAction() {
        deleteOrg({}, {
            onSuccess: () => {
                onChange();
                setOpen(false);
            }
        })
    }

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpen}
        >
            {organizationDetail ? (
                <>
                    <Dialog.Header>
                        <HStack width="100%" justify="space-between" alignItems="start">
                            <HStack>
                                <IconButton rounded="sm" variant="ghost" onClick={() => refetch()} size="sm">
                                    <HiOutlineRefresh color="gray" />
                                </IconButton>
                                <OrganizationName status={organizationDetail.status}>
                                    <Dialog.Title>
                                        {organizationDetail.name}
                                    </Dialog.Title>
                                </OrganizationName>
                                <EditNameBtn
                                    name={organizationDetail.name}
                                    oid={organizationDetail.id}
                                    refetch={refetch}
                                />
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
                            {isManager && (
                                <>
                                    <Verification
                                        organization={organizationDetail}
                                        onChange={() => {
                                            refetch();
                                            onChange();
                                        }}
                                    />
                                    <Separator />
                                </>
                            )}
                            <DataListItem label="Status">
                                <HStack>
                                    <Button size="sm" variant="outline"
                                        colorPalette={organizationDetail.status === OrganizationStatusEnum.VERIFIED ? "blue" : "black"}
                                        cursor="default"
                                    >
                                        {getOrgStatusCode(organizationDetail.status)}
                                    </Button>
                                    {
                                        (
                                            isWide &&
                                            organizationDetail.status === OrganizationStatusEnum.REGISTERED &&
                                            isDelegator
                                        ) && (
                                            <RequestVerifyBtn
                                                oid={organizationDetail.id}
                                                refetch={refetch}
                                            />
                                        )
                                    }
                                </HStack>
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Delegator">
                                <DataList.Root orientation="horizontal">
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
                                <HStack w="100%" justify="space-between" alignItems="center" pr={2}>
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
                                        "Student Number",
                                        "Name",
                                        "email",
                                        "manage"
                                    ]}
                                    content={organizationDetail.members.map((u) => ({
                                        id: u.id,
                                        row: [
                                            u.user.studentNumber,
                                            u.user.nameKr,
                                            u.user.email,
                                            "Will be implemented later"
                                        ],
                                    }))}
                                />
                            </DataListItem>
                        </DataList.Root>
                    </Dialog.Body >
                    <Separator />
                    <Dialog.Footer>
                        {isDelegator && (
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
            ) : (<LoadingComponent />)}
        </SimpleDialog >
    );
}