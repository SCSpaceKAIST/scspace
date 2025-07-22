"use client";

import { Card, Grid, GridItem, IconButton, Stack, Text } from "@chakra-ui/react";
import { DateForm, HourForm } from "../Forms";
import React, { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { useDate } from "@scspace-client/Hooks/utils";

export interface IReservationRepeat {
    dateFrom: Date;
    dateTo: Date;
    hourFrom: number;
    hourTo: number;
    correct: boolean;
}

function ResCard({
    dateFrom, dateTo, setDateFrom, setDateTo, setHourFrom, setHourTo
}: {
    dateFrom: Date;
    dateTo: Date;
    setDateFrom: (date: Date) => void;
    setDateTo: (date: Date) => void;
    setHourFrom: (hour: number) => void;
    setHourTo: (hour: number) => void;
}) {
    return (
        <Grid
            templateColumns="repeat(6, 1fr)"
            gap={8}
            py={2}
        >
            <GridItem colSpan={{ base: 6, md: 3 }}>
                <DateForm
                    label="start date"
                    date={dateFrom}
                    setDate={setDateFrom}
                />
            </GridItem>
            <GridItem colSpan={{ base: 6, md: 3 }}>
                <DateForm
                    label="end date"
                    date={dateTo}
                    setDate={setDateTo}
                />
            </GridItem>
            <GridItem colSpan={{ base: 6, md: 3 }}>
                <HourForm
                    label="start time"
                    setHour={setHourFrom}
                />
            </GridItem>
            <GridItem colSpan={{ base: 6, md: 3 }}>
                <HourForm
                    label="end time"
                    setHour={setHourTo}
                />
            </GridItem>
        </Grid>
    );
}

export default function ReservationCard({ resList, setResList }: {
    resList: IReservationRepeat[];
    setResList: React.Dispatch<React.SetStateAction<IReservationRepeat[]>>;
}) {
    const _init = new Date();
    const { getTime } = useDate();

    return (
        <Stack>
            {resList.map((res, index) => (
                <Card.Root
                    key={index}
                    borderColor={res.correct ? "bg.emphasized" : "red"}
                    borderWidth={res.correct ? 1 : 2}
                    size="sm"
                >
                    <Card.Body>
                        {(!res.correct) && (
                            <Card.Description color={"red"} fontWeight={"semibold"}>
                                시작 시간이 끝 시간보다 늦을 수 없습니다.
                            </Card.Description>
                        )}
                        <ResCard
                            dateFrom={res.dateFrom}
                            dateTo={res.dateTo}
                            setDateFrom={(date) => {
                                const newList = [...resList];
                                newList[index] = {
                                    ...newList[index],
                                    dateFrom: date,
                                    correct: getTime(date) + getTime({ hour: newList[index].hourFrom }) <= getTime(newList[index].dateTo) + getTime({ hour: newList[index].hourTo })
                                };
                                setResList(newList);
                            }}
                            setDateTo={(date) => {
                                const newList = [...resList];
                                newList[index] = {
                                    ...newList[index],
                                    dateTo: date,
                                    correct: getTime(date) + getTime({ hour: newList[index].hourTo }) >= getTime(newList[index].dateFrom) + getTime({ hour: newList[index].hourFrom })
                                };
                                setResList(newList);
                            }}
                            setHourFrom={(hour) => {
                                const newList = [...resList];
                                newList[index] = {
                                    ...newList[index],
                                    hourFrom: hour,
                                    correct: getTime(newList[index].dateFrom) + getTime({ hour }) <= getTime(newList[index].dateTo) + getTime({ hour: newList[index].hourTo })
                                };
                                setResList(newList);
                            }}
                            setHourTo={(hour) => {
                                const newList = [...resList];
                                newList[index] = {
                                    ...newList[index],
                                    hourTo: hour,
                                    correct: getTime(newList[index].dateTo) + getTime({ hour }) >= getTime(newList[index].dateFrom) + getTime({ hour: newList[index].hourFrom })
                                };
                                setResList(newList);
                            }}
                        />
                    </Card.Body>
                    {(index === resList.length - 1) && (
                        <Card.Footer justifyContent="flex-end">
                            {(resList.length !== 1) && (
                                <IconButton
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => {
                                        const newList = resList.filter((_, i) => i !== index);
                                        setResList(newList);
                                    }}
                                >
                                    <HiMinus />
                                </IconButton>
                            )}
                            <IconButton
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => {
                                    setResList((l) => [
                                        ...l,
                                        {
                                            dateFrom: new Date(_init.getFullYear(), _init.getMonth(), _init.getDate()),
                                            dateTo: new Date(_init.getFullYear(), _init.getMonth(), _init.getDate()),
                                            hourFrom: 0,
                                            hourTo: 0,
                                            correct: true
                                        }
                                    ]);
                                }}
                            >
                                <HiPlus />
                            </IconButton>
                        </Card.Footer>
                    )}
                </Card.Root>
            ))}
        </Stack>
    )
}