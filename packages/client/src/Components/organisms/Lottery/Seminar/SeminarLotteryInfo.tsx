"use client"

import React, { useEffect, useState } from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import {
    Stack,
    Alert,
    IconButton,
    Flex,
} from "@chakra-ui/react";
import { useSeminarLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { dateUtils } from "@scspace-client/Hooks/utils";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import { HiPlus } from "react-icons/hi2";
import SeminarLotteryInfoModal from "@scspace-client/Components/organisms/Lottery/Seminar/SeminarLotteryInfoModal";
import { ILotteryInfo } from "@scspace-depot/types/lottery/lottery.info.type";

export default function SeminarLotteryInfo() {
    const { needAdmin } = useAuth();
    needAdmin();
    const {
        allLotteryInfo: {
            data: lotteryInfos,
            isLoading,
            refetch
        }
    } = useSeminarLotteryInfoAPI();

    const { getDateString } = dateUtils();

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
            <SeminarLotteryInfoModal
                info={selectedInfo}
                open={open}
                setOpen={setOpen}
                refetch={refetch}
            />
            <Scroll>
                {isLoading ? (<LoadingComponent />) : (
                    <Stack>
                        <Flex justify={"flex-end"}>
                            <IconButton
                                variant={"outline"}
                                onClick={() => {
                                    setSelectedId(0);
                                    setOpen(true);
                                }}
                            >
                                <HiPlus />
                            </IconButton>
                        </Flex>

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
