"use client"

import {
    Table,
    Flex,
    Text,
    Button,
    Grid,
    Dialog,
    Portal,
    Center,
    Heading,
    Separator,
    Stack,
    CloseButton,
    StackSeparator,
    Wrap,
    Box,
    Field,
    IconButton
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Scroll from "../_commons/Scroll";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useOrganization, useOrganizationDetail } from "@scspace-client/Hooks/organization";
import { IOrganizationResponse } from "@scspace-depot/types/organization";
import { IUser } from "@scspace-depot/types/user";
import { HiMiniXMark } from "react-icons/hi2";

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

function OrgDetail({ org }: { org: IOrganizationResponse }) {
    return (
        <Stack
            separator={<StackSeparator />}
        >
            <Grid
                templateColumns="auto 1fr"
                gap={4}
            >
                <Box
                    width='24vh'
                    textAlign="end"
                    alignItems="end"
                >
                    <Text
                        margin={0}
                        padding={0}
                        fontSize="lg"
                        fontWeight="semibold"
                    >
                        Deligator
                    </Text>
                </Box>
                <Wrap gap={2}>
                    <Member user={org.delegator} />
                </Wrap>
            </Grid>
            <Grid
                templateColumns="auto 1fr"
                gap={4}
            >
                <Box
                    width='24vh'
                    textAlign="end"
                    alignItems="end"
                >
                    <Text
                        margin={0}
                        padding={0}
                        fontSize="lg"
                        fontWeight="semibold"
                    >
                        Members
                    </Text>
                </Box>
                {org.members.map((m) => (
                    <Wrap gap={2}>
                        <Member user={m.user} />
                    </Wrap>
                ))}
            </Grid>
        </Stack>
    );
}

export default function Organization() {
    const { userInfo, needLogin } = useAuth();
    const [selected, setSelected] = useState<number>(-1);

    useEffect(() => {
        needLogin();
    }, []);

    const { organization } = useOrganization({ uid: userInfo?.id });
    const { organizationDetail } = useOrganizationDetail({ id: selected });

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
                                    {organization.map((org) => (
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
                                <Dialog.Header>
                                    <Dialog.Title>
                                        {organizationDetail?.name ?? "Loding..."}
                                    </Dialog.Title>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton size="sm" />
                                    </Dialog.CloseTrigger>
                                </Dialog.Header>
                                <Separator />
                                {organizationDetail && (
                                    <Dialog.Body>
                                        <OrgDetail org={organizationDetail} />
                                    </Dialog.Body>
                                )}
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            ) : (
                <Center height="100%">
                    <Heading margin={0} padding={0}>
                        Loding...
                    </Heading>
                </Center>
            )}
        </Scroll >
    );
}