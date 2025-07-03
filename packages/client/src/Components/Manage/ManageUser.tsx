"use client"

import {
    Flex,
    Grid,
    HStack,
    IconButton,
    Table,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/_commons/Scroll";
import LoadingComponent from "@scspace-client/Components/Loading/Loading";
import TooltipComponent from "@scspace-client/Components/Tooltip/Tooptip";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { useAllUser } from "@scspace-client/Hooks/user";
import { IUser } from "@scspace-depot/types/user";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";

function classify(type: UserTypeEnum): string {
    switch (type) {
        case UserTypeEnum.ADMIN:
            return "Admin"
        case UserTypeEnum.MANAGER:
            return "Manager"
        case UserTypeEnum.WORKER:
            return "Worker"
        default:
            return "User"
    }
}

export default function ManageUser() {
    const { needManager } = useAuth();
    needManager();

    const { users, refetch } = useAllUser();

    const [selected, setSelected] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <>
            {/* <CalendarDialog
                open={open}
                setOpen={setOpen}
                selectedRes={selected}
                refetch={refetch}
            /> */}
            <Scroll>
                {!users ? (
                    <LoadingComponent />
                ) : (
                    <Grid
                        height="100%"
                        templateRows="auto 1fr auto"
                        gap={2}
                    >
                        <Flex
                            width="100%"
                            justify={isWide ? "space-between" : "end"}
                            alignItems="end"
                        >
                            {isWide && (
                                <Text margin={0} color="gray.focusRing">
                                    Click each row to see detail of reservation
                                </Text>
                            )}
                            <HStack
                                gap={2}
                                width={isWide ? "fit-content" : "100%"}
                                justify="space-between"
                            >
                                <TooltipComponent content="Refresh">
                                    <IconButton
                                        rounded="sm"
                                        variant="ghost"
                                        onClick={() => refetch()}
                                    >
                                        <HiOutlineRefresh color="gray" />
                                    </IconButton>
                                </TooltipComponent>
                            </HStack>
                        </Flex>
                        <Scroll>
                            <Table.Root
                                stickyHeader
                                interactive
                                colorPalette="blue"
                            >
                                <Table.ColumnGroup>
                                    <Table.Column htmlWidth={isWide ? "25%" : "50%"} />
                                    <Table.Column htmlWidth={isWide ? "25%" : "50%"} />
                                    {isWide && (
                                        <>
                                            <Table.Column htmlWidth="25%" />
                                            <Table.Column htmlWidth="25%" />
                                        </>
                                    )}
                                </Table.ColumnGroup>
                                <Table.Header>
                                    <Table.Row bg="bg.muted">
                                        <Table.ColumnHeader>
                                            StudentNumber
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            Name
                                        </Table.ColumnHeader>
                                        {isWide && (
                                            <>
                                                <Table.ColumnHeader>
                                                    email
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader>
                                                    Class
                                                </Table.ColumnHeader>
                                            </>
                                        )}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {users.map((u: IUser) => (
                                        <Table.Row
                                            key={u.id}
                                            onClick={() => {
                                                setSelected(u.id);
                                                setOpen(true);
                                            }}
                                            cursor="pointer"
                                        >
                                            <Table.Cell>
                                                {u.studentNumber}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {u.nameKr}
                                            </Table.Cell>
                                            {isWide && (
                                                <>
                                                    <Table.Cell>
                                                        {u.email}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {classify(u.type)}
                                                    </Table.Cell>
                                                </>
                                            )}
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Scroll>
                    </Grid>
                )}
            </Scroll>
        </>
    );
};