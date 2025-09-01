"use client"

import {
    Center,
    Flex,
    Grid,
    HStack,
    IconButton,
    NumberInput,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useReservationAPI } from "@scspace-client/Hooks/reservation";
import { useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { IReservationAll } from "@scspace-depot/types/reservation";
import { useDate } from "@scspace-client/Hooks/utils";
import ReservationDetail from "@scspace-client/Components/organisms/Reservation/Detail";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import TooltipComponent from "../../../atoms/Tooptip";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import OrgSelect from "@scspace-client/Components/organisms/Reservation/Listing/OrgSelect";
import SimplePagination from "@scspace-client/Components/molecules/page/SimplePagenation";

export default function WorkHistory() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const { getString } = useDate();

    const [selected, setSelected] = useState<IReservationAll | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const isWide = useBreakpointValue({ base: false, md: true });

    const { data: reservation, refetch } = useReservationAPI().workHistory;

    useEffect(() => {
        setSelected(reservation?.at(0) ?? null);
    }, [reservation]);

    return (
        <>
            <ReservationDetail
                open={open}
                setOpen={setOpen}
                selectedRes={selected}
                refetch={refetch}
            />
            <Scroll>
                {!reservation ? (
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
                        <SimpleTable
                            onIdChange={(id) => {
                                const res = reservation.find((r) => r.id === id);
                                if (res) {
                                    setSelected(res);
                                    setOpen(true);
                                }
                            }}
                            header={["Title", "Booker", "From", "To"]}
                            content={reservation.map((r) => ({
                                id: r.id,
                                row: [
                                    r.title,
                                    r.organizationId !== 1 ? r.organization.name : r.user.nameKr,
                                    getString(r.timeFrom),
                                    getString(r.timeTo)
                                ]
                            }))}
                        />
                    </Grid>
                )}
            </Scroll>
        </>
    );
};
