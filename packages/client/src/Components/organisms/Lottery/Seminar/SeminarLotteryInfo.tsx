"use client"

import React, { useEffect, useState } from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import {
    Stack,
    Text,
    Alert,
    HStack,
    IconButton,
    Button,
} from "@chakra-ui/react";
import { useSeminarLotteryAPI, useSeminarLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { useDate } from "@scspace-client/Hooks/utils";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import { HiPlus } from "react-icons/hi2";
import SeminarLotteryInfoDetailModal from "@scspace-client/Components/organisms/Lottery/Seminar/SeminarInfoDetailModal";
import { ILotteryInfo } from "@scspace-depot/types/lottery/lottery.info.type";

export default function SeminarLotteryInfo() {
    const { needAdmin } = useAuth();
    needAdmin();
    const { data: lotteryInfos, isLoading, refetch } = useSeminarLotteryInfoAPI().allLotteryInfo;
    const applySeminarLottery = useSeminarLotteryAPI().applySeminarLottery;

    const { getDateString } = useDate();

    const [open, setOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [selectedInfo, setSelectedInfo] = useState<ILotteryInfo | null>(null);
    useEffect(() => {
        if (selectedId === 0) {
            setSelectedInfo(null);
        } else {
            setSelectedInfo(lotteryInfos?.find(info => info.id === selectedId) || null);
        }
    }, [selectedId, lotteryInfos]);

    return (
        <>
            <SeminarLotteryInfoDetailModal
                info={selectedInfo}
                open={open}
                setOpen={setOpen}
                refetch={refetch}
            />
            <Scroll>
                {isLoading ? (<LoadingComponent />) : (
                    <Stack>
                        <HStack justify="space-between">
                            <Text fontSize="2xl" fontWeight="bold">세미나실 정기 예약 추첨</Text>
                            <IconButton
                                variant={"outline"}
                                onClick={() => {
                                    setSelectedId(0);
                                    setOpen(true);
                                }}
                            >
                                <HiPlus />
                            </IconButton>
                            <Button onClick={() => applySeminarLottery({}, {
                                onSuccess: () => {
                                    alert("check server logs");
                                }
                            })}>
                                Apply Test
                            </Button>
                        </HStack>

                        {!lotteryInfos || lotteryInfos.length === 0 ? (
                            <Alert.Root status="info">
                                <Alert.Indicator />
                                <Alert.Title>등록된 추첨 정보가 없습니다.</Alert.Title>
                            </Alert.Root>
                        ) : (
                            <SimpleTable
                                onIdChange={(id: number) => {
                                    setSelectedId(id);
                                    setOpen(true);
                                }}
                                header={[
                                    "추첨 시작 날짜",
                                    "추첨 종료 날짜",
                                    "학기 시작 날짜",
                                    "학기 종료 날짜",
                                ]}
                                content={lotteryInfos.map(info => ({
                                    id: info.id,
                                    row: [
                                        getDateString(info.timeLotteryStart),
                                        getDateString(info.timeLotteryEnd),
                                        getDateString(info.timeStart),
                                        getDateString(info.timeEnd),
                                    ],
                                }))}
                            />
                        )}

                    </Stack>
                )}
            </Scroll>
        </>
    );
}
