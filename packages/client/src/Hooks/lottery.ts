"use client"

import { useMutationApi, useQueryApi } from "./api";
import { ILotteryInfo, ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery/lottery.info.type";
import { ISuccessResponse } from "@scspace-depot/types/common/common.type";

// 통합 Lottery API Hook
export function useLotteryInfoAPI(id?: number) {
    // GET Hook들을 최상위에서 호출
    const allLotteryInfo = useQueryApi<ILotteryInfo[]>("/lottery/seminar/info");
    const activeLotteryInfo = useQueryApi<ILotteryInfo[]>("/lottery/seminar/info/active");
    const upcomingLotteryInfo = useQueryApi<ILotteryInfo[]>("/lottery/seminar/info/upcoming");

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
        // GET 데이터와 상태들
        allLotteryInfo,
        activeLotteryInfo,
        upcomingLotteryInfo,

        // CUD 메서드들
        createLotteryInfo,
        updateLotteryInfo,
        deleteLotteryInfo
    };
}
