"use client";

import { Text } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useEffect, useState } from "react";
import ResTime from "../Manager/NewTime";
import { dateUtils } from "@scspace-client/Hooks/utils";
import { useReservationAPI } from "@scspace-client/Hooks/reservation";
import UpdateBtn from "@scspace-client/Components/molecules/buttons/UpdateBtn";

export default function ChangeTimeBtn({ rid, refetch, timeFrom, timeTo }: {
    rid: number;
    timeFrom: number;
    timeTo: number;
    refetch: () => any;
}) {
    const { getDateUnit, getTime } = dateUtils();
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
        <UpdateBtn
            tooltipContent="Change Reservation Time"
            onUpdate={() => updateRes({
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
                },
                onError: (error) => {
                    toaster.error({
                        title: "Update Failed",
                        description: error.message || "An error occurred while updating the reservation."
                    });
                }
            })}
            title="Change Reservation Time"
            updateDisallowed={!isCorrect}
        >
            {!isCorrect && (
                <Text color="red.500" fontWeight="semibold">
                    The selected time range is invalid. Please ensure that the start time is before the end time.
                </Text>
            )}
            <ResTime
                inDialog
                dateFrom={dateFrom}
                dateTo={dateTo}
                setDateFrom={setDateFrom}
                setDateTo={setDateTo}
                hourFrom={hourFrom}
                hourTo={hourTo}
                setHourFrom={setHourFrom}
                setHourTo={setHourTo}
            />
        </UpdateBtn>
    );
}