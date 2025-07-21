"use client"

import {
    ButtonGroup,
    Center,
    Flex,
    Grid,
    HStack,
    IconButton,
    NumberInput,
    Pagination,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useUserReservation } from "@scspace-client/Hooks/reservation";
import { useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { IReservationAll } from "@scspace-depot/types/reservation";
import { useDate } from "@scspace-client/Hooks/utils";
import CalendarDialog from "@scspace-client/Components/organisms/Calendar/CalendarDialog";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useOrganization } from "@scspace-client/Hooks/organization";
import TooltipComponent from "../../../atoms/Tooptip";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import OrgSelect from "@scspace-client/Components/organisms/Reservation/Listing/OrgSelect";
import SimplePagination from "@scspace-client/Components/molecules/page/SimplePagenation";

export default function UserReservation() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const [oid, setOid] = useState<number>(0);
    const { organization } = useOrganization({ uid: userInfo?.id ?? -1 });

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
                                justify="space-between"
                            >
                                <OrgSelect
                                    organization={organization || []}
                                    setOid={setOid}
                                    oid={oid}
                                />
                                {isWide && (
                                    <NumberInput.Root
                                        value={_limit}
                                        onValueChange={(e) => _setLimit(e.value)}
                                        min={10}
                                        width="90px"
                                    >
                                        <NumberInput.Control />
                                        <TooltipComponent content="One-page limit">
                                            <NumberInput.Input />
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
                        <SimpleTable
                            onIdChange={(id) => {
                                const res = userReservation.find((r) => r.id === id);
                                if (res) {
                                    setSelected(res);
                                    setOpen(true);
                                }
                            }}
                            header={["Title", "Booker", "From", "To"]}
                            content={userReservation.map((r) => ({
                                id: r.id,
                                row: [
                                    r.title,
                                    r.organization.name,
                                    getString(r.timeFrom),
                                    getString(r.timeTo)
                                ]
                            }))}
                        />
                        <Center width="100%">
                            <SimplePagination
                                count={count}
                                pageSize={limit}
                                page={page}
                                onPageChange={({ page }) => setPage(page)}
                            />
                        </Center>
                    </Grid>
                )}
            </Scroll>
        </>
    );
};
