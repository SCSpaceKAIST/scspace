"use client"

import { Button, Card, Dialog, Stack, Text, VStack, Wrap } from "@chakra-ui/react";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import { useLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import { useDate } from "@scspace-client/Hooks/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function InfoDetailModal({ id, open, setOpen, refetch }: {
    id?: number;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    refetch: () => void;
}) {
    const { createLotteryInfo } = useLotteryInfoAPI();

    const today = new Date();
    const { getTime, getDateString } = useDate();

    const [dateLotteryStart, setDateLotteryStart] = useState<Date>(
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
    const [dateLotteryEnd, setDateLotteryEnd] = useState<Date>(
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
    const [dateStart, setDateStart] = useState<Date>(
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
    const [dateEnd, setDateEnd] = useState<Date>(
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );

    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        setIsError(
            dateLotteryStart >= dateLotteryEnd ||
            dateStart < dateLotteryEnd ||
            dateEnd <= dateStart
        )
    }, [dateLotteryStart, dateLotteryEnd, dateStart, dateEnd,]);

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpen}
        >
            <Dialog.Header>
                <Dialog.Title>
                    세미나실 정기 예약 추첨 정보
                </Dialog.Title>
                <Dialog.Description>

                </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
                <Wrap justify="center">
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>추첨 날짜</Card.Title>
                            <Card.Description>
                                추첨 기간동안 매일 오후 6시에 자동으로 추첨이 진행됩니다.
                            </Card.Description>
                        </Card.Header>
                        <Card.Body>
                            <Stack align={"center"}>
                                <Text>
                                    {getDateString(getTime(dateLotteryStart))} ~ {getDateString(getTime(dateLotteryEnd))}
                                </Text>
                                <Wrap justify="center">
                                    <DatePicker
                                        wrapperClassName="datepicker"
                                        selected={dateLotteryStart}
                                        onChange={(date) => {
                                            if (!date) return;
                                            setDateLotteryStart(date);
                                        }}
                                        inline
                                    />
                                    <DatePicker
                                        wrapperClassName="datepicker"
                                        selected={dateLotteryEnd}
                                        onChange={(date) => {
                                            if (!date) return;
                                            setDateLotteryEnd(date);
                                        }}
                                        inline
                                    />
                                </Wrap>
                            </Stack>
                        </Card.Body>
                    </Card.Root>
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>행사 날짜</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Stack align={"center"}>
                                <Text>
                                    {getDateString(getTime(dateStart))} ~ {getDateString(getTime(dateEnd))}
                                </Text>
                                <Wrap justify="center">
                                    <DatePicker
                                        wrapperClassName="datepicker"
                                        selected={dateStart}
                                        onChange={(date) => {
                                            if (!date) return;
                                            setDateStart(date);
                                        }}
                                        inline
                                    />
                                    <DatePicker
                                        wrapperClassName="datepicker"
                                        selected={dateEnd}
                                        onChange={(date) => {
                                            if (!date) return;
                                            setDateEnd(date);
                                        }}
                                        inline
                                    />
                                </Wrap>
                            </Stack>
                        </Card.Body>
                    </Card.Root>
                </Wrap>
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                    <DeleteBtn onDelete={() => alert("delete")} />
                </Dialog.ActionTrigger>
                <Button
                    disabled={isError}
                    colorPalette="blue"
                    onClick={() => {
                        createLotteryInfo({
                            timeLotteryStart: getTime(dateLotteryStart),
                            timeLotteryEnd: getTime(dateLotteryEnd),
                            timeStart: getTime(dateStart),
                            timeEnd: getTime(dateEnd),
                        }, {
                            onSuccess: () => {
                                toaster.success({
                                    title: "추첨 정보 추가 완료",
                                    description: "추첨 정보가 성공적으로 추가되었습니다.",
                                });
                                refetch();
                                setOpen(false);
                            },
                            onError: (error) => {
                                toaster.error({
                                    title: "추첨 정보 추가 실패",
                                    description: error.message || "추첨 정보 추가에 실패했습니다.",
                                });
                            },
                        });
                    }}
                >
                    Save
                </Button>
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline">
                        Close
                    </Button>
                </Dialog.ActionTrigger>
            </Dialog.Footer>
        </SimpleDialog>
    );
}
