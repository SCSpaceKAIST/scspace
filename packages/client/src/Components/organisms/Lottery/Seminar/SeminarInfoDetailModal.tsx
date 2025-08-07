"use client"

import { Button, Card, Dialog, Stack, Text, VStack, Wrap } from "@chakra-ui/react";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import { useLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import { useDate } from "@scspace-client/Hooks/utils";
import { ILotteryInfo } from "@scspace-depot/types/lottery/lottery.info.type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SeminarLotteryInfoDetailModal({ info, open, setOpen, refetch }: {
    info: ILotteryInfo | null;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    refetch: () => void;
}) {
    const {
        createLotteryInfo,
        deleteLotteryInfo,
        updateLotteryInfo
    } = useLotteryInfoAPI(info?.id || 0);

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
            today >= dateLotteryStart ||
            dateLotteryStart >= dateLotteryEnd ||
            dateLotteryEnd >= dateStart ||
            dateStart >= dateEnd
        )
    }, [dateLotteryStart, dateLotteryEnd, dateStart, dateEnd,]);

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpen}
        >
            <Dialog.Header>
                <Stack>
                    <Dialog.Title>
                        세미나실 정기 예약 추첨 정보
                    </Dialog.Title>
                    {isError && (
                        <Dialog.Description color="red" fontWeight={"bold"}>
                            날짜 설정에 오류가 있습니다. 날짜 순서를 확인해주세요.
                        </Dialog.Description>
                    )}
                </Stack>
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
                                <Card.Title>
                                    {getDateString(getTime(dateLotteryStart))} ~ {getDateString(getTime(dateLotteryEnd))}
                                </Card.Title>
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
                            <Card.Title>학기 기간</Card.Title>
                            <Card.Description>
                                추첨 결과가 반영되는 날짜입니다.
                            </Card.Description>
                        </Card.Header>
                        <Card.Body>
                            <Stack align={"center"}>
                                <Card.Title>
                                    {getDateString(getTime(dateStart))} ~ {getDateString(getTime(dateEnd))}
                                </Card.Title>
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
                {info ? (<>
                    <DeleteBtn onDelete={() => {
                        deleteLotteryInfo({}, {
                            onSuccess: () => {
                                toaster.success({
                                    title: "추첨 정보 삭제 완료",
                                    description: "추첨 정보가 성공적으로 삭제되었습니다.",
                                });
                                refetch();
                                setOpen(false);
                            },
                            onError: (error) => {
                                toaster.error({
                                    title: "추첨 정보 삭제 실패",
                                    description: error.message || "추첨 정보 삭제에 실패했습니다.",
                                });
                            },
                        })
                    }} />
                    <Button
                        disabled={isError}
                        colorPalette="blue"
                        onClick={() => {
                            updateLotteryInfo({
                                timeLotteryStart: getTime(dateLotteryStart),
                                timeLotteryEnd: getTime(dateLotteryEnd),
                                timeStart: getTime(dateStart),
                                timeEnd: getTime(dateEnd),
                            }, {
                                onSuccess: () => {
                                    toaster.success({
                                        title: "추첨 정보 업데이트 완료",
                                        description: "추첨 정보가 성공적으로 업데이트되었습니다.",
                                    });
                                    refetch();
                                    setOpen(false);
                                },
                                onError: (error) => {
                                    toaster.error({
                                        title: "추첨 정보 업데이트 실패",
                                        description: error.message || "추첨 정보 업데이트에 실패했습니다.",
                                    });
                                },
                            });
                        }}
                    >
                        Update
                    </Button>
                </>) : (
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
                )}
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline">
                        Close
                    </Button>
                </Dialog.ActionTrigger>
            </Dialog.Footer>
        </SimpleDialog>
    );
}
