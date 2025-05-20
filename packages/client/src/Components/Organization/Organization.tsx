"use client"

import {
    Table,
    Flex,
    Text,
    Button,
    Grid,
    Dialog,
    Portal,
    Separator,
    Wrap,
    Field,
    IconButton,
    DataList,
    HStack
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import Scroll from "../_commons/Scroll";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useOrganization, useOrganizationAPI, useOrganizationDetail } from "@scspace-client/Hooks/organization";
import { IOrganization, IOrganizationResponse } from "@scspace-depot/types/organization";
import { IUser } from "@scspace-depot/types/user";
import { HiMiniXMark, HiPlus } from "react-icons/hi2";
import TooltipComponent from "../Tooltip/Tooptip";
import LoadingComponent from "../Loading/Loading";
import { HiOutlineRefresh } from "react-icons/hi";
import InputComponent from "../Reservation/forms/utils/Input";

function Member({ user }: { user: IUser }) {
    return (
        <Field.Root
            borderWidth="1px"
            rounded="sm"
            padding={2}
            width="fit-content"
            textAlign="center"
        >
            <Flex
                width="100%"
                justify="space-between"
            >
                <Text
                    margin={0}
                    padding={0}
                    fontSize="xl"
                    fontWeight="semibold"
                    width="fit-content"
                >
                    {user.nameKr}
                </Text>
                <IconButton
                    variant="outline"
                    rounded="sm"
                    width="fit-content"
                    height="fit-content"
                    disabled
                >
                    <HiMiniXMark />
                </IconButton>
            </Flex>
            <Field.HelperText>
                {user.studentNumber} {user.nameEn}
            </Field.HelperText>
        </Field.Root>
    );
}

function Delete({ id, onSuccess }: {
    id: number;
    onSuccess: () => any;
}) {
    const deleteOrganization = useOrganizationAPI({ id }).deleteOrg
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog.Root
            role="alertdialog"
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Dialog.Trigger asChild>
                <Button colorPalette="red" rounded="sm">
                    Delete
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Are you sure?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our systems.
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                colorPalette="red"
                                rounded="sm"
                                onClick={() => deleteOrganization({}, {
                                    onSuccess: () => {
                                        console.log(1);
                                        onSuccess();
                                        setOpen(false);
                                    }
                                })}
                            >
                                Delete
                            </Button>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" rounded="sm">
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    );
}

function OrgDetail({ id, onDelete }: {
    id: number;
    onDelete: () => any;
}) {
    const { organizationDetail, refetch } = useOrganizationDetail({ id: id });

    return (organizationDetail ? (
        <>
            <Dialog.Header>
                <HStack width="100%" justify="space-between">
                    <HStack>
                        <IconButton rounded="sm" variant="ghost" onClick={() => refetch()}>
                            <HiOutlineRefresh color="gray" />
                        </IconButton>
                        <Dialog.Title>
                            {organizationDetail.name}
                        </Dialog.Title>
                    </HStack>
                    <DataList.Root orientation="horizontal" gap={1}>
                        <DataList.Item gap={0}>
                            <DataList.ItemLabel>
                                Create Time
                            </DataList.ItemLabel>
                            <DataList.ItemValue margin={0}>
                                {organizationDetail.timeRegister}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item gap={0}>
                            <DataList.ItemLabel>
                                Update Time
                            </DataList.ItemLabel>
                            <DataList.ItemValue margin={0}>
                                {organizationDetail.timeUpdate}
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
                            <Member user={organizationDetail.delegator} />
                        </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>
                            Members
                        </DataList.ItemLabel>
                        <DataList.ItemValue margin={0}>
                            <Wrap>
                                {organizationDetail.members.map((m) => (
                                    <Member key={m.user.email} user={m.user} />
                                ))}
                            </Wrap>
                        </DataList.ItemValue>
                    </DataList.Item>
                </DataList.Root>
            </Dialog.Body >
            <Separator />
            <Dialog.Footer>
                <Delete
                    id={id}
                    onSuccess={() => onDelete()}
                />
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

function NewOrg({ uid, onSuccess }: {
    uid: number | null;
    onSuccess: () => any;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const generateOrganization = useOrganizationAPI().generateOrg;

    return (
        <Dialog.Root
            initialFocusEl={() => inputRef.current}
        >
            <Dialog.Trigger asChild>
                <IconButton
                    variant="outline"
                    rounded="sm"
                >
                    <HiPlus />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Make New Organization
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body pb="4">
                            <InputComponent
                                label="Organization Name"
                                placeholder="Input Name"
                                ref={inputRef}
                                value={name}
                                setValue={setName}
                            />
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" rounded="sm">
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    rounded="sm"
                                    onClick={() => {
                                        if (name && uid) {
                                            setOpen(false);
                                            generateOrganization({
                                                name: name,
                                                delegatorId: uid
                                            }, {
                                                onSuccess: () => onSuccess()
                                            });
                                        }
                                    }}
                                >
                                    Generate
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default function Organization() {
    const { userInfo, needLogin } = useAuth();
    const [selected, setSelected] = useState<number>(-1);

    useEffect(() => needLogin());

    const { organization, refetch } = useOrganization({ uid: userInfo?.id });

    const [open, setOpen] = useState<boolean>(false);

    return (
        <Scroll>
            {organization ? (
                <Dialog.Root
                    open={open}
                    onOpenChange={(e) => setOpen(e.open)}
                    size="cover"
                    initialFocusEl={() => null}
                >
                    <Grid
                        height="100%"
                        templateRows="auto 1fr"
                        gap={2}
                    >
                        <Flex
                            width="100%"
                            justify="space-between"
                            alignItems="end"
                        >
                            <Text
                                margin={0}
                                color="gray.focusRing"
                            >
                                Click each row to see detail of organization
                            </Text>
                            <HStack>
                                <TooltipComponent
                                    content="Refresh"
                                >
                                    <IconButton
                                        rounded="sm"
                                        variant="ghost"
                                        onClick={() => refetch()}
                                    >
                                        <HiOutlineRefresh color="gray" />
                                    </IconButton>
                                </TooltipComponent>
                                <TooltipComponent
                                    content="Make New Organization"
                                >
                                    <NewOrg
                                        uid={userInfo?.id ?? 0}
                                        onSuccess={refetch}
                                    />
                                </TooltipComponent>
                            </HStack>
                        </Flex>
                        <Scroll>
                            <Table.Root
                                stickyHeader
                                interactive
                                colorPalette="blue"
                            >
                                <Table.Header >
                                    <Table.Row bg="bg.muted">
                                        <Table.ColumnHeader>
                                            Name
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            Delegator
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            Create Time
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            Update Time
                                        </Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {organization.map((org: IOrganization) => (
                                        <Table.Row
                                            key={org.id}
                                            onClick={() => {
                                                setSelected(org.id);
                                                setOpen(true);
                                            }}
                                            cursor="pointer"
                                        >
                                            <Table.Cell>
                                                {org.name}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {org.delegatorId}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {org.timeRegister}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {org.timeUpdate}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Scroll>
                    </Grid>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <OrgDetail
                                    id={selected}
                                    onDelete={() => {
                                        refetch();
                                        setOpen(false);
                                    }}
                                />
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            ) : (
                <LoadingComponent />
            )}
        </Scroll >
    );
}