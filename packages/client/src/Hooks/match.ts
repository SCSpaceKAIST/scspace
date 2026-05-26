"use client";

import { useMutationApi, useQueryApi } from "./api";
import { IMatchInfo, IMatchPredictionCreate, IMatchPredictionWithInfo } from "@scspace-depot/types/match";
import { ISuccessResponse } from "@scspace-depot/types/common";

export function useMatchAPI() {
    const allMatches = useQueryApi<{ status: string; data: IMatchInfo[] }>("/match");

    const createPrediction = useMutationApi<ISuccessResponse, IMatchPredictionCreate>(
        "/match/prediction",
        "POST"
    ).mutate;

    return {
        allMatches,
        createPrediction,
    };
}

export function useMatchPredictionAPI(userId?: number) {
    const myPredictions = useQueryApi<{ status: string; data: IMatchPredictionWithInfo[] }>(
        `/match/prediction/${userId ?? 0}`,
    );

    return {
        myPredictions,
    };
}
