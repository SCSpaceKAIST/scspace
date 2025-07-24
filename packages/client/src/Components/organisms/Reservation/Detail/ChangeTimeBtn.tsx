"use client";

import { Dialog, DialogBackdrop, Button, Portal, Text, IconButton } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { useEffect, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import ResTime from "../Manager/NewTime";
import { useDate } from "@scspace-client/Hooks/utils";
import { useReservationAPI } from "@scspace-client/Hooks/reservation";

export default function ChangeTimeBtn({ rid, refetch, timeFrom, timeTo }: {
    rid: number;
    timeFrom: number;
    timeTo: number;
    refetch: () => any;
}) {
    const { getDateUnit, getTime } = useDate();
    const { updateRes } = useReservationAPI({ rid });

    const timeToUnit = getDateUnit(timeTo);
    const timeFromUnit = getDateUnit(timeFrom);

    const [dateFrom, setDateFrom] = useState<Date>(new Date(
        timeFromUnit.year, timeFromUnit.month, timeFromUnit.date
    ));

    const [dateTo, setDateTo] = useState<Date>(new Date(
        timeToUnit.year, timeToUnit.month, timeToUnit.date
    ));

    const [hourFrom, setHourFrom] = useState<number>(timeFromUnit.hour);
    const [hourTo, setHourTo] = useState<number>(timeToUnit.hour);

    const [newTimeFrom, setNewTimeFrom] = useState<number>(
        getTime(dateFrom) + getTime({ hour: hourFrom })
    );

    useEffect(() => {
        setNewTimeFrom(getTime(dateFrom) + getTime({ hour: hourFrom }));
    }, [dateFrom, hourFrom]);

    const [newTimeTo, setNewTimeTo] = useState<number>(
        getTime(dateTo) + getTime({ hour: hourTo })
    );

    useEffect(() => {
        setNewTimeTo(getTime(dateTo) + getTime({ hour: hourTo }));
    }, [dateTo, hourTo]);

    const [isCorrect, setIsCorrect] = useState<boolean>(newTimeFrom <= newTimeTo);

    useEffect(() => {
        setIsCorrect(newTimeFrom <= newTimeTo);
    }, [newTimeFrom, newTimeTo]);

    return (
        <Dialog.Root
            role="alertdialog"
            placement="center"
        >
            <TooltipComponent content="Edit Name">
                <Dialog.Trigger asChild>
                    <IconButton size="sm" variant="ghost" rounded="sm">
                        <HiOutlinePencilAlt color="gray" />
                    </IconButton>
                </Dialog.Trigger>
            </TooltipComponent>
            <Portal>
                <DialogBackdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Edit Reservated Time
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {!isCorrect && (
                                <Dialog.Description color="red.500" fontWeight="semibold">
                                    The selected time range is invalid. Please ensure that the start time is before the end time.
                                </Dialog.Description>
                            )}
                            <ResTime
                                dateFrom={dateFrom}
                                dateTo={dateTo}
                                setDateFrom={setDateFrom}
                                setDateTo={setDateTo}
                                setHourFrom={setHourFrom}
                                setHourTo={setHourTo}
                            />
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                colorPalette="blue"
                                rounded="sm"
                                disabled={!isCorrect}
                                onClick={() => updateRes({
                                    id: rid,
                                    timeFrom: newTimeFrom,
                                    timeTo: newTimeTo
                                }, {
                                    onSuccess: () => {
                                        toaster.success({
                                            title: "Reservation Updated",
                                            description: "The reservation time has been updated successfully."
                                        });
                                        refetch();
                                    }
                                })}
                            >
                                Update
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