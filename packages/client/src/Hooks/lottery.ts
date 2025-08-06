"use client"

import { useEffect, useState } from "react";
import { useMutationApi, useQueryApi } from "./api";
import { ILotteryInfo, ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery/lottery.info.type";
import { ISuccessResponse } from "@scspace-depot/types/common/common.type";

export function useLotteryInfo() {
    const [lotteryInfos, setLotteryInfos] = useState<ILotteryInfo[] | null>(null);
    const { data, isLoading, refetch } = useQueryApi<ILotteryInfo[]>("/lottery/seminar/info");

    useEffect(() => {
        if (!data) {
            setLotteryInfos(null);
            return;
        }

        setLotteryInfos(data);
    }, [data]);

    return { lotteryInfos, isLoading, refetch };
}

export function useLotteryInfoAPI(id = 0) {
    const createLotteryInfo = useMutationApi<ILotteryInfo, ILotteryInfoCreate>(
        "/lottery/seminar/info",
        "POST"
    ).mutate;

    const updateLotteryInfo = useMutationApi<ILotteryInfo, ILotteryInfoUpdate>(
        `/lottery/seminar/info/${id}`,
        "PUT"
    ).mutate;

    const deleteLotteryInfo = useMutationApi<ISuccessResponse, {}>(
        `/lottery/seminar/info/${id}`,
        "DELETE"
    ).mutate;

    return {
        createLotteryInfo,
        updateLotteryInfo,
        deleteLotteryInfo
    };
}
