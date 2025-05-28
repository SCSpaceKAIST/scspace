"use client"

import {
    Table,
    Flex,
    Text,
    Grid,
    Dialog,
    Portal,
    IconButton,
    HStack,
    useBreakpointValue
} from "@chakra-ui/react";
import { useState, } from "react";
import Scroll from "../_commons/Scroll";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useOrganization, } from "@scspace-client/Hooks/organization";
import { IOrganizationDelegator, } from "@scspace-depot/types/organization";
import TooltipComponent from "../Tooltip/Tooptip";
import LoadingComponent from "../Loading/Loading";
import { HiOutlineRefresh } from "react-icons/hi";

import OrganizationDetail from "./OrganizationDetail";
import NewOrganizationBtn from "./NewOrganizationBtn";
import { useDate } from "@scspace-client/Hooks/utils";

export default function Organization() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const [selected, setSelected] = useState<number>(-1);

    const { organization, refetch } = useOrganization({ uid: userInfo?.id });

    const [open, setOpen] = useState<boolean>(false);

    const { getString } = useDate();

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Scroll>
            {organization ? (
                <Dialog.Root
                    open={open}
                    onOpenChange={(e) => setOpen(e.open)}
                    size={isWide ? "cover" : "full"}
                >
                    <Grid
                        height="100%"
                        templateRows="auto 1fr"
                        gap={2}
                    >
                        <Flex
                            width="100%"
                            justify={isWide ? "space-between" : "end"}
                            alignItems="end"
                        >
                            {isWide && (
                                <Text margin={0} color="gray.focusRing">
                                    Click each row to see detail of organization
                                </Text>
                            )}
                            <HStack>
                                <TooltipComponent content="Refresh">
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
                                    <NewOrganizationBtn
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
                                        {isWide && (
                                            <>
                                                <Table.ColumnHeader>
                                                    Create Time
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader>
                                                    Update Time
                                                </Table.ColumnHeader>
                                            </>
                                        )}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {organization.map((org: IOrganizationDelegator) => (
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
                                                {org.delegator.nameKr}
                                            </Table.Cell>
                                            {isWide && (
                                                <>
                                                    <Table.Cell>
                                                        {getString(org.timeRegister)}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {getString(org.timeUpdate)}
                                                    </Table.Cell>
                                                </>
                                            )}
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Scroll>
                    </Grid>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content className={isWide ? "" : "full"}>
                                <OrganizationDetail
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