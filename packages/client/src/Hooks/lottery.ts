"use client"

import { useMutationApi, useQueryApi } from "./api";
import { ILotteryInfo, ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery/lottery.info.type";
import { ISeminarLottery, ISeminarLotteryCreate } from "@scspace-depot/types/lottery/lottery.seminar.type";
import { ISuccessResponse } from "@scspace-depot/types/common/common.type";

// 통합 Lottery Info API Hook (추첨 정보 관리)
export function useSeminarLotteryInfoAPI(id?: number) {
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

    const applySeminarLottery = useMutationApi<ISuccessResponse, {}>(
        `/lottery/seminar/apply`,
        "POST"
    ).mutate;

    const drawSeminarLottery = useMutationApi<ISuccessResponse, {}>(
        `/lottery/seminar/draw`,
        "POST"
    ).mutate;

    return {
        // GET 데이터와 상태들
        allLotteryInfo,
        activeLotteryInfo,
        upcomingLotteryInfo,

        // CUD 메서드들
        createLotteryInfo,
        updateLotteryInfo,
        deleteLotteryInfo,

        applySeminarLottery,
        drawSeminarLottery
    };
}

// 통합 Seminar Lottery API Hook (세미나 추첨 신청 관리)
export function useSeminarLotteryAPI(params?: {
    id?: number;
    organizationId?: number;
    spaceId?: number;
    infoId?: number;
    time?: number
}) {
    const { id, organizationId, spaceId, infoId, time } = params || {
        id: -1,
        organizationId: -1,
        spaceId: -1,
        infoId: -1,
        time: -1
    };

    // GET Hook들을 최상위에서 호출
    const lotteryByOrganization = useQueryApi<ISeminarLottery[]>(
        `/lottery/seminar?organizationId=${organizationId}&spaceId=${spaceId}&infoId=${infoId}`
    );

    const lotteryByTime = useQueryApi<ISeminarLottery[]>(
        `/lottery/seminar/time?time=${time}&spaceId=${spaceId}&infoId=${infoId}`
    );

    const timeSlotCounts = useQueryApi<{ time: number; count: number }[]>(
        `/lottery/seminar/time/count?spaceId=${spaceId}&infoId=${infoId}`
    );

    const drawnLottery = useQueryApi<ISeminarLottery[]>(
        `/lottery/seminar/time/drawn?spaceId=${spaceId}&infoId=${infoId}`
    );

    // POST/PUT/DELETE 메서드들
    const createSeminarLottery = useMutationApi<ISeminarLottery, ISeminarLotteryCreate>(
        "/lottery/seminar",
        "POST"
    ).mutate;

    const deleteSeminarLottery = useMutationApi<ISuccessResponse, {}>(
        `/lottery/seminar/${id}`,
        "DELETE"
    ).mutate;



    return {
        // GET 데이터와 상태들
        lotteryByOrganization,
        lotteryByTime,
        timeSlotCounts,
        drawnLottery,

        // CUD 메서드들
        createSeminarLottery,
        deleteSeminarLottery,
    };
}
