"use client"

import {
    Table,
    Flex,
    Text,
    Button,
    Grid,
    Dialog,
    CloseButton,
    Portal,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Scroll from "../_commons/Scroll";
import { useAuth } from "@scspace-client/Hooks/auth";
import { IOrganization } from "@scspace-depot/types/organization";

export default function Organization() {
    const {
        userInfo,
        needLogin
    } = useAuth();

    useEffect(() => {
        needLogin();
    }, []);

    const [orgs, setOrgs] = useState<IOrganization[]>([
        {
            id: 0,
            name: "temp",
            delegatorId: 0,
            timeRegister: 'r time',
            timeUpdate: 'u time'
        },
    ])

    const [open, setOpen] = useState<boolean>(false);

    return (
        <Scroll>
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
                            Click each row to see detail of organization {userInfo?.id}
                        </Text>
                        <Button
                            variant="outline"
                            rounded="sm"
                            onClick={() => setOpen(true)}
                        >
                            Make new organization
                        </Button>
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
                                {orgs.map((org) => (
                                    <Table.Row
                                        key={org.id}
                                        onClick={() => setOpen(true)}
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
                            <Dialog.Header>
                                <Dialog.Title>Dialog Title</Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Scroll >
    );
}