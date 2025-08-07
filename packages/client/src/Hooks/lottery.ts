"use client"

import { useMutationApi, useQueryApi } from "./api";
import { ILotteryInfo, ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery/lottery.info.type";
import { ISuccessResponse } from "@scspace-depot/types/common/common.type";

// 통합 Lottery API Hook
export function useLotteryInfoAPI(id?: number) {
    // GET 메서드들
    const getAllLotteryInfo = () => {
        return useQueryApi<ILotteryInfo[]>("/lottery/seminar/info");
    };

    const getActiveLotteryInfo = () => {
        return useQueryApi<ILotteryInfo[]>("/lottery/seminar/info/active");
    };

    const getUpcomingLotteryInfo = () => {
        return useQueryApi<ILotteryInfo[]>("/lottery/seminar/info/upcoming");
    };

    // POST/PUT/DELETE 메서드들
    const createLotteryInfo = useMutationApi<ILotteryInfo, ILotteryInfoCreate>(
        "/lottery/seminar/info",
        "POST"
    ).mutate;

    const updateLotteryInfo = useMutationApi<ILotteryInfo, ILotteryInfoUpdate>(
        `/lottery/seminar/info/${id || ''}`,
        "PUT"
    ).mutate;

    const deleteLotteryInfo = useMutationApi<ISuccessResponse, {}>(
        `/lottery/seminar/info/${id || ''}`,
        "DELETE"
    ).mutate;

    return {
        // GET 메서드들
        getAllLotteryInfo,
        getActiveLotteryInfo,
        getUpcomingLotteryInfo,

        // CUD 메서드들
        createLotteryInfo,
        updateLotteryInfo,
        deleteLotteryInfo
    };
}