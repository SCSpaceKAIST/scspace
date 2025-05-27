"use client"

import {
    Button,
    Dialog,
    Separator,
    Wrap,
    IconButton,
    DataList,
    HStack,
    Text,
    Stack,
    useBreakpointValue
} from "@chakra-ui/react";
import { useOrganizationDetail } from "@scspace-client/Hooks/organization";
import LoadingComponent from "../Loading/Loading";
import { HiOutlineRefresh } from "react-icons/hi";

import Member from "./Member";
import DeleteBtn from "./DeleteBtn";
import AddMemberBtn from "./AddMemberBtn";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useEffect, useState } from "react";
import { useDate } from "@scspace-client/Hooks/utils";

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
                            <DataList.Item gap={0}>
                                <DataList.ItemLabel>
                                    Create Time
                                </DataList.ItemLabel>
                                <DataList.ItemValue margin={0}>
                                    {getString(organizationDetail.timeRegister)}
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                        <DataList.Item gap={0}>
                            <DataList.ItemLabel>
                                Update Time
                            </DataList.ItemLabel>
                            <DataList.ItemValue margin={0}>
                                {getString(organizationDetail.timeUpdate)}
                            </DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                </HStack>
            </Dialog.Header>
            <Separator />
            <Dialog.Body px={8} py={4}>
                <DataList.Root orientation="horizontal">
                    <DataList.Item>
                        <DataList.ItemLabel>
                            Delegator
                        </DataList.ItemLabel>
                        <DataList.ItemValue margin={0}>
                            <Member
                                refetch={refetch}
                                oid={id}
                                user={organizationDetail.delegator}
                                showDeleteButton={false}
                            />
                        </DataList.ItemValue>
                    </DataList.Item>
                    <Separator />
                    <DataList.Item alignItems="start">
                        <DataList.ItemLabel>
                            <HStack gap={2}>
                                <Text margin={0} padding={0}>
                                    Members
                                </Text>
                                <AddMemberBtn
                                    oid={organizationDetail.id}
                                    refetch={refetch}
                                    disabled={!isDelegator}
                                />
                            </HStack>
                        </DataList.ItemLabel>
                        <DataList.ItemValue margin={0}>
                            <Wrap>
                                {organizationDetail.members.map((m) => (
                                    <Member
                                        refetch={refetch}
                                        oid={id}
                                        key={m.user.email} user={m.user}
                                        deletable={isDelegator && (m.user.id !== organizationDetail.delegator.id)}
                                    />
                                ))}
                            </Wrap>
                        </DataList.ItemValue>
                    </DataList.Item>
                </DataList.Root>
            </Dialog.Body >
            <Separator />
            <Dialog.Footer>
                {(isDelegator) && (
                    <DeleteBtn
                        id={id}
                        onSuccess={() => onDelete()}
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