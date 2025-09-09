"use client";

import { Card, IconButton, Stack } from "@chakra-ui/react";
import React from "react";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { dateUtils } from "@scspace-client/Hooks/utils";
import ResTime from "./NewTime";

export interface IReservationRepeat {
    dateFrom: Date;
    dateTo: Date;
    hourFrom: number;
    hourTo: number;
    correct: boolean;
}

export default function ReservationCard({ resList, setResList }: {
    resList: IReservationRepeat[];
    setResList: React.Dispatch<React.SetStateAction<IReservationRepeat[]>>;
}) {
    const { getTime } = dateUtils();

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
                        <ResTime
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
                                            dateFrom: new Date(resList[resList.length - 1].dateFrom.getFullYear(), resList[resList.length - 1].dateFrom.getMonth(), resList[resList.length - 1].dateFrom.getDate()),
                                            dateTo: new Date(resList[resList.length - 1].dateTo.getFullYear(), resList[resList.length - 1].dateTo.getMonth(), resList[resList.length - 1].dateTo.getDate()),
                                            hourFrom: resList[resList.length - 1].hourFrom,
                                            hourTo: resList[resList.length - 1].hourTo,
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