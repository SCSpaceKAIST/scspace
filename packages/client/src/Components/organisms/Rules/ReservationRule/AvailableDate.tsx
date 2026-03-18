"use client"

import { Card, Center } from "@chakra-ui/react";
import { dateUtils } from "@scspace-client/Hooks/utils";
import { SpaceTypeEnum } from "@scspace-depot/enums/space.enum";
import { reservationMinDate, reservationMaxDate } from "@scspace-depot/consts/reservation.const";
import { useEffect, useState } from "react";

export default function AvailableDate({ spaceType }: { spaceType: SpaceTypeEnum }) {
    const { getDateString, getTime } = dateUtils();

    const [startString, setStartString] = useState<string>("loading...");
    const [endString, setEndString] = useState<string>("loading...");

    useEffect(() => {
        const startDate = new Date();
        const endDate = new Date();

        startDate.setDate(startDate.getDate() + reservationMinDate[spaceType]);
        endDate.setDate(endDate.getDate() + reservationMaxDate[spaceType]);

        setStartString(getDateString(getTime(startDate)));
        setEndString(getDateString(getTime(endDate)));
    }, [spaceType, getDateString, getTime]);

    return (
        <Card.Root border={"1px solid"} borderColor={"gray.200"} size={"sm"} bg={"inherit"}>
            <Card.Header>
                <Card.Description>
                    예약 가능 날짜
                </Card.Description>
            </Card.Header>
            <Card.Body>
                <Center>
                    <Card.Title>
                        {startString} To {endString}
                    </Card.Title>
                </Center>
            </Card.Body>
        </Card.Root>
    );
}
