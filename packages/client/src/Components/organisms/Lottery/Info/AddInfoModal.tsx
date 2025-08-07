"use client"

import { Button, Card, Dialog, Wrap } from "@chakra-ui/react";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import { useDate } from "@scspace-client/Hooks/utils";
import { Dispatch, SetStateAction, useState } from "react";
import DatePicker from "react-datepicker";

export default function InfoDetailModal({ id, open, setOpen, refetch }: {
    id?: number;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    refetch: () => void;
}) {
    const { createLotteryInfo } = useLotteryInfoAPI();

    const today = new Date();
    const { getTime } = useDate();

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

    return (
        <SimpleDialog
            open={true}
            setOpen={() => { }}
        >
            <Dialog.Header>
                <Dialog.Title>
                    세미나실 정기 예약 추첨 정보 추가
                </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <Wrap justify="center">
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>추첨 시작 날짜</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DatePicker
                                wrapperClassName="datepicker"
                                selected={dateLotteryStart}
                                onChange={(date) => {
                                    if (!date) return;
                                    setDateLotteryStart(date);
                                }}
                                inline
                            />
                        </Card.Body>
                    </Card.Root>
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>추첨 종료 날짜</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DatePicker
                                wrapperClassName="datepicker"
                                selected={dateLotteryEnd}
                                onChange={(date) => {
                                    if (!date) return;
                                    setDateLotteryEnd(date);
                                }}
                                inline
                            />
                        </Card.Body>
                    </Card.Root>
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>행사 시작 날짜</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DatePicker
                                wrapperClassName="datepicker"
                                selected={dateStart}
                                onChange={(date) => {
                                    if (!date) return;
                                    setDateStart(date);
                                }}
                                inline
                            />
                        </Card.Body>
                    </Card.Root>
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>행사 종료 날짜</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DatePicker
                                wrapperClassName="datepicker"
                                selected={dateEnd}
                                onChange={(date) => {
                                    if (!date) return;
                                    setDateEnd(date);
                                }}
                                inline
                            />
                        </Card.Body>
                    </Card.Root>
                </Wrap>
            </Dialog.Body>
            <Dialog.Footer>
                <Button
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
