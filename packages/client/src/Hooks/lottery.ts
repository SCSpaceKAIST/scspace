"use client"

import { useMutationApi, useQueryApi } from "./api";
import { ILotteryInfo, ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery/lottery.info.type";
import { ISeminarLottery, ISeminarLotteryCreate } from "@scspace-depot/types/lottery/lottery.seminar.type";
import { IPerformanceLottery, IPerformanceLotteryCreate } from "@scspace-depot/types/lottery/lottery.performance.type";
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

// 통합 Performance Lottery Info API Hook (공연 추첨 정보 관리)
export function usePerformanceLotteryInfoAPI(id?: number) {
    // GET Hook들을 최상위에서 호출
    const allLotteryInfo = useQueryApi<ILotteryInfo[]>("/lottery/performance/info");
    const activeLotteryInfo = useQueryApi<ILotteryInfo[]>("/lottery/performance/info/active");
    const upcomingLotteryInfo = useQueryApi<ILotteryInfo[]>("/lottery/performance/info/upcoming");

    // POST/PUT/DELETE 메서드들
    const createLotteryInfo = useMutationApi<ILotteryInfo, ILotteryInfoCreate>(
        "/lottery/performance/info",
        "POST"
    ).mutate;

    const updateLotteryInfo = useMutationApi<ILotteryInfo, ILotteryInfoUpdate>(
        `/lottery/performance/info/${id || ''}`,
        "PUT"
    ).mutate;

    const deleteLotteryInfo = useMutationApi<ISuccessResponse, {}>(
        `/lottery/performance/info/${id || ''}`,
        "DELETE"
    ).mutate;

    const drawPerformanceLottery = useMutationApi<ISuccessResponse, {}>(
        `/lottery/performance/draw/${id || ''}`,
        "PUT"
    ).mutate;

    const exchangePerformanceLottery = useMutationApi<ISuccessResponse, { fromId: number; toId: number }>(
        `/lottery/performance/exchange`,
        "PUT"
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

        drawPerformanceLottery,
        exchangePerformanceLottery
    };
}

// 통합 Performance Lottery API Hook (공연 추첨 신청 관리)
export function usePerformanceLotteryAPI(params?: {
    id?: number;
    organizationId?: number;
    spaceId?: number;
    infoId?: number;
    date?: number
}) {
    const { id, organizationId, spaceId, infoId, date } = params || {
        id: -1,
        organizationId: -1,
        spaceId: -1,
        infoId: -1,
        date: -1
    };

    // GET Hook들을 최상위에서 호출
    const lotteryByOrganization = useQueryApi<IPerformanceLottery[]>(
        `/lottery/performance?organizationId=${organizationId}&spaceId=${spaceId}&infoId=${infoId}`
    );

    const lotteryByDate = useQueryApi<IPerformanceLottery[]>(
        `/lottery/performance/date?date=${date}&spaceId=${spaceId}&infoId=${infoId}`
    );

    const dateSlotCounts = useQueryApi<{ date: number; count: number }[]>(
        `/lottery/performance/dateslot-counts?spaceId=${spaceId}&infoId=${infoId}`
    );

    const drawnLottery = useQueryApi<IPerformanceLottery[]>(
        `/lottery/performance/drawn?spaceId=${spaceId}&infoId=${infoId}`
    );

    // POST/PUT/DELETE 메서드들
    const createPerformanceLottery = useMutationApi<IPerformanceLottery, IPerformanceLotteryCreate>(
        "/lottery/performance",
        "POST"
    ).mutate;

    const deletePerformanceLottery = useMutationApi<ISuccessResponse, {}>(
        `/lottery/performance/${id}`,
        "DELETE"
    ).mutate;

    return {
        // GET 데이터와 상태들
        lotteryByOrganization,
        lotteryByDate,
        dateSlotCounts,
        drawnLottery,

        // CUD 메서드들
        createPerformanceLottery,
        deletePerformanceLottery,
    };
}
