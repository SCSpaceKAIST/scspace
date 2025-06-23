"use client"

import {
    ButtonGroup,
    Center,
    Dialog,
    Flex,
    Grid,
    HStack,
    IconButton,
    NumberInput,
    Pagination,
    Portal,
    Table,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/_commons/Scroll";
import LoadingComponent from "@scspace-client/Components/Loading/Loading";
import TooltipComponent from "@scspace-client/Components/Tooltip/Tooptip";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useUserReservation } from "@scspace-client/Hooks/reservation";
import { useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { IReservationAll } from "@scspace-depot/types/reservation";
import { useDate } from "@scspace-client/Hooks/utils";
import CalendarDialog from "@scspace-client/Components/Calendar/CalendarDialog";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function UserReservation() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [_limit, _setLimit] = useState<string>("10");
    const { getString } = useDate();

    useEffect(() => {
        if (parseInt(_limit) != limit) setLimit(parseInt(_limit));
    }, [_limit]);

    const [selected, setSelected] = useState<IReservationAll | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const isWide = useBreakpointValue({ base: false, md: true });

    const { userReservation, count, refetch } = useUserReservation({
        uid: userInfo?.id || 0,
        limit,
        offset: limit * (page - 1)
    });

    useEffect(() => { refetch(); }, [page, limit, userInfo?.id || 0]);

    useEffect(() => {
        console.log(userReservation);
        setSelected(userReservation[0] || null);
    }, [userReservation]);

    return (
        <>
            <CalendarDialog
                open={open}
                setOpen={setOpen}
                selectedRes={selected}
                refetch={refetch}
            />
            <Scroll>
                {!userReservation ? (
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
                            <HStack gap={2}>
                                <NumberInput.Root
                                    value={_limit}
                                    onValueChange={(e) => _setLimit(e.value)}
                                    min={1}
                                >
                                    <NumberInput.Control />
                                    {/* <TooltipComponent content="One-page limit"> */}
                                    <NumberInput.Input />
                                    {/* </TooltipComponent> */}
                                </NumberInput.Root>
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
                                <Table.Header>
                                    <Table.Row bg="bg.muted">
                                        <Table.ColumnHeader>
                                            Title
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            Booker
                                        </Table.ColumnHeader>
                                        {isWide && (
                                            <>
                                                <Table.ColumnHeader>
                                                    From
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader>
                                                    To
                                                </Table.ColumnHeader>
                                            </>
                                        )}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {userReservation.map((r: IReservationAll) => (
                                        <Table.Row
                                            key={r.id}
                                            onClick={() => {
                                                setSelected(r);
                                                setOpen(true);
                                            }}
                                            cursor="pointer"
                                        >
                                            <Table.Cell>
                                                {r.title}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {r.organization.name}
                                            </Table.Cell>
                                            {isWide && (
                                                <>
                                                    <Table.Cell>
                                                        {getString(r.timeFrom)}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {getString(r.timeTo)}
                                                    </Table.Cell>
                                                </>
                                            )}
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Scroll>
                        <Center width="100%">
                            <Pagination.Root
                                count={count}
                                pageSize={limit}
                                // siblingCount={2}
                                page={page}
                                onPageChange={(e) => setPage(e.page)}
                            >
                                <ButtonGroup variant="ghost">
                                    <Pagination.PrevTrigger asChild>
                                        <IconButton>
                                            <HiChevronLeft />
                                        </IconButton>
                                    </Pagination.PrevTrigger>
                                    <Pagination.Items
                                        render={(p) => (
                                            <IconButton
                                                variant={{
                                                    base: "ghost",
                                                    _selected: "outline"
                                                }}
                                            >
                                                {p.value}
                                            </IconButton>
                                        )}
                                    />
                                    <Pagination.NextTrigger asChild>
                                        <IconButton>
                                            <HiChevronRight />
                                        </IconButton>
                                    </Pagination.NextTrigger>
                                </ButtonGroup>
                            </Pagination.Root>
                        </Center>
                    </Grid>
                )}
            </Scroll>
        </>
    );
};
