"use client"

import { useEffect, useState } from "react";
import { useMutationApi, useQueryApi } from "./api";
import { ILotteryInfo, ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery/lottery.info.type";

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

export function useLotteryAPI() {
    const createLotteryInfo = useMutationApi<ILotteryInfo, { lotteryInfo: ILotteryInfoCreate }>(
        "/lottery/seminar/info",
        "POST"
    );

    const updateLotteryInfo = async (id: number, updateData: ILotteryInfoUpdate) => {
        const res = await fetch(`/api/lottery/seminar/info/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updateData),
        });

        if (!res.ok) {
            throw new Error(res.statusText);
        }

        return res.json();
    };

    return {
        createLotteryInfo,
        updateLotteryInfo
    };
}
