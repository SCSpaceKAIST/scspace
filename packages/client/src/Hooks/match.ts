"use client";

import { useMutation } from "@tanstack/react-query";
import { useMutationApi, useQueryApi } from "./api";
import { IMatchInfo, IMatchPredictionCreate, IMatchPredictionUpdate, IMatchPredictionWithInfo } from "@scspace-depot/types/match";
import { ISuccessResponse } from "@scspace-depot/types/common";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function useMatchAPI() {
    const allMatches = useQueryApi<{ status: string; data: IMatchInfo[] }>("/match");

    const createPrediction = useMutationApi<ISuccessResponse, IMatchPredictionCreate>(
        "/match/prediction",
        "POST"
    ).mutate;

    const updatePredictionMutation = useMutation<ISuccessResponse, Error, { id: number } & IMatchPredictionUpdate>({
        mutationFn: async ({ id, ...data }) => {
            const res = await fetch(`${baseUrl}/match/prediction/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                let msg = res.statusText;
                try { msg = (await res.json()).message || msg; } catch {}
                throw new Error(msg);
            }
            return res.json();
        },
    });

    return {
        allMatches,
        createPrediction,
        updatePrediction: updatePredictionMutation.mutate,
        isUpdating: updatePredictionMutation.isPending,
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
