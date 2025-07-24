import {
    Box,
    Center,
    Flex,
    Grid,
    GridItem,
    Text,
    Float,
    Button,
} from "@chakra-ui/react";
import { useDateReservations, useReservations } from "@scspace-client/Hooks/reservation";
import { useEffect, useState } from "react";
import { IReservationAll } from "@scspace-depot/types/reservation";
import ReservationDetail from "../Detail";
import { stringToColor } from "@scspace-client/Hooks/utils";

export function CalendarView({ refetchCounter = 0, spaceId, dateFrom, dateTo }: {
    refetchCounter?: number;
    spaceId: number;
    dateFrom: Date;
    dateTo: Date;
}) {
    const { dateReservation, refetch } = useDateReservations({ spaceId, dateFrom, dateTo, });
    const dates = Object.keys(dateReservation);
    const times = Array.from({ length: 24 }, (_, i) => i);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => { refetch() }, [refetchCounter, refetch]);

    const [selected, setSelected] = useState<number>(0);
    const { reservations, refetch: refetchDetail } = useReservations({ spaceId, dateFrom, dateTo });
    const [selectedRes, setSelectedRes] = useState<IReservationAll | null>(null);

    useEffect(() => {
        if (!reservations) {
            setSelectedRes(null);
            return;
        }
        const filtered = reservations.find(r => (r.id === selected));
        if (!filtered) {
            setSelectedRes(null);
            return;
        }
        setSelectedRes(filtered);
    }, [selected]);

    return (
        <>
            <ReservationDetail
                open={open}
                setOpen={setOpen}
                selectedRes={selectedRes}
                refetch={refetch}
            />
            <Box
                id="scroll"
                position="relative"
                overflowX="auto"
                overflowY="auto"
                minH={0}
                minW={0}
                maxH="100%"
                maxW="100%"
                rounded="sm"
                borderLeftWidth="1px"
                borderTopWidth="1px"
                bg="white"
            >
                <Grid
                    templateColumns={`60px repeat(${Object.keys(dateReservation).length}, 1fr)`}
                    templateRows="auto repeat(24, 1fr)"
                    gap={0}
                    minW="100%"
                    width="fit-content"
                    maxW="fit-content"
                >
                    <GridItem
                        rowStart={1}
                        colStart={1}
                        bg="bg.muted"
                        position="sticky"
                        top={0}
                        left={0}
                        zIndex={3}
                        borderBottomWidth="1px"
                        borderRightWidth="1px"
                    />

                    {/* Date headers */}
                    {dates.map((date, i) => (
                        <GridItem
                            key={date}
                            rowStart={1}
                            colStart={i + 2}      // shift right by 1
                            bg="bg.muted"
                            position="sticky"
                            top={0}
                            zIndex={1}
                            borderBottomWidth="1px"
                            borderRightWidth="1px"
                            textAlign="center"
                            minW={{ base: "120px", md: 0 }}
                            width="100%"
                        >
                            <Text fontWeight="semibold" mx={0} my={2} padding={0}>
                                {date}
                            </Text>
                        </GridItem>
                    ))}

                    {/* Time labels in first column */}
                    {times.map((hour) => (
                        <GridItem
                            key={hour}
                            rowStart={hour + 2}   // shift down by 1
                            colStart={1}
                            bg="bg.muted"
                            position="sticky"
                            left={0}
                            zIndex={1}
                            borderRightWidth="1px"
                            borderBottomWidth={(hour === 23) ? "1px" : "0"}
                            height="64px"
                        >
                            <Center height="100%" mx={3} color="bg.muted">
                                <Text fontSize="sm" margin={0} padding={0} visibility="hidden">
                                    00:00
                                </Text>
                                {(hour > 0) && (
                                    <Float placement="top-center">
                                        <Text fontSize="sm" margin={0} padding={0} color="black">
                                            {hour.toString().padStart(2, "0")}:00
                                        </Text>
                                    </Float>
                                )}
                            </Center>
                        </GridItem>
                    ))}

                    {/* Now the actual day slots */}
                    {dates.map((date, ci) =>
                        times.map((hour) => {
                            const _slot = dateReservation[date].map((d, i) => { return { slot: d, i } }).find(
                                (r) => (r.slot.hourFrom <= hour && r.slot.hourTo > hour)
                            );
                            const slot = _slot?.slot ?? null;
                            const i = _slot?.i ?? -1;
                            if (slot && slot.hourFrom === hour) {
                                // span multi-hour bookings
                                return (
                                    <GridItem
                                        key={`${date}-${hour}`}
                                        rowStart={hour + 2}
                                        colStart={ci + 2}
                                        rowSpan={slot.hourTo - slot.hourFrom}
                                        bg={stringToColor(slot.title)}
                                        minW={0}
                                        overflow="hidden"
                                    >
                                        <Button
                                            asChild
                                            rounded="0"
                                            variant="ghost"
                                            width="100%"
                                            height="100%"
                                            minW={0}
                                            padding={1}
                                            onClick={() => {
                                                setSelected(slot.id);
                                                setOpen(true)
                                            }}
                                        >
                                            <Flex
                                                flexDir="column"
                                                width="100%"
                                                height="100%"
                                                margin={0}
                                                padding={1}
                                                gap={0}
                                                justifyContent="center"
                                                overflow="hidden"
                                                minW={0}
                                            >
                                                <Text
                                                    margin={0}
                                                    padding={0}
                                                    fontWeight="semibold"
                                                    width="100%"
                                                    textOverflow="ellipsis"
                                                    whiteSpace="nowrap"
                                                    overflow="hidden"
                                                    textAlign="center"
                                                >
                                                    {slot.title}
                                                </Text>
                                                <Text
                                                    margin={0}
                                                    padding={0}
                                                    fontSize="xs"
                                                    width="100%"
                                                    textOverflow="ellipsis"
                                                    whiteSpace="nowrap"
                                                    overflow="hidden"
                                                    textAlign="center"
                                                >
                                                    {slot.name}
                                                </Text>
                                            </Flex>
                                        </Button>
                                    </GridItem>
                                );
                            } else if (
                                !slot ||
                                slot.hourFrom === 0 && slot.hourTo === 24 && i > 0 ||
                                dateReservation[date][i - 1] && dateReservation[date][i - 1].hourTo <= hour
                            ) {
                                return (
                                    <GridItem
                                        key={`${date}-${hour}`}
                                        rowStart={hour + 2}
                                        colStart={ci + 2}
                                        borderBottomWidth="1px"
                                        borderRightWidth="1px"
                                        height="64px"
                                        minW={0}
                                    />
                                );
                            }

                            return null;
                        })
                    )}
                </Grid>
            </Box>
        </>
    );
}