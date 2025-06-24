"use client"

import {
    ButtonGroup,
    Center,
    createListCollection,
    Dialog,
    Flex,
    Grid,
    HStack,
    IconButton,
    NumberInput,
    Pagination,
    Portal,
    Select,
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
import { useOrganization } from "@scspace-client/Hooks/organization";

export default function UserReservation() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const [oid, setOid] = useState<number>(-1);
    const [_oid, _setOid] = useState<string[]>(["-1"]);
    useEffect(() => {
        const _t = parseInt(_oid[0]);
        if (_t != oid) setOid(_t);
    }, [_oid]);

    const { organization } = useOrganization({ uid: userInfo?.id ?? -1 });
    const [options, setOptions] = useState<{ label: string; value: string }[]>([
        { label: "All", value: "-1" },
        { label: "Individual", value: "0" }
    ]);
    const optionList = createListCollection({ items: options });
    useEffect(() => {
        if (!organization) {
            setOptions([
                { label: "All", value: "-1" },
                { label: "Individual", value: "0" },
            ]);
            return;
        }
        setOptions([
            { label: "All", value: "-1" },
            { label: "Individual", value: "0" },
            ...organization.map((o) => ({
                label: o.name,
                value: o.id.toString()
            }))
        ])
    }, [organization]);

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
        oid,
        limit,
        offset: limit * (page - 1)
    });

    useEffect(() => { refetch(); }, [page, limit, userInfo?.id || 0]);

    useEffect(() => {
        setSelected(userReservation[0] || null);
    }, [userReservation]);

    return (
        <>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {optionList.items.map((option) => (
                            <Select.Item
                                item={option}
                                key={option.value}
                            >
                                {option.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
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
                            <HStack
                                gap={2}
                                width={isWide ? "fit-content" : "100%"}
                                justify={isWide ? "space-between" : "end"}
                            >
                                <TooltipComponent content="Organization">
                                    <Select.Root
                                        collection={optionList}
                                        value={_oid}
                                        onValueChange={(e) => _setOid(e.value)}
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger>
                                                <Select.ValueText />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                    </Select.Root>
                                </TooltipComponent>
                                {isWide && (
                                    <NumberInput.Root
                                        value={_limit}
                                        onValueChange={(e) => _setLimit(e.value)}
                                        min={10}
                                    >
                                        <NumberInput.Control />
                                        <TooltipComponent content="One-page limit">
                                            <NumberInput.Input
                                                width="fit-content"
                                            />
                                        </TooltipComponent>
                                    </NumberInput.Root>
                                )}
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
