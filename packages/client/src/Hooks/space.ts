"use client"

import { ISpace } from "@scspace-depot/types/space";
import { useQueryApi } from "./useAPI";
import { useEffect, useState } from "react";

export function useSpace({ id }: { id: number }) {
    const [space, setSpace] = useState<ISpace | null>(null);
    const { data, isLoading, refetch } = useQueryApi<ISpace>(`/space/${id}`);

    useEffect(() => {
        if (!data) {
            setSpace(null);
            return;
        }

        setSpace(data);
    }, [data])

    return { space, isLoading, refetch };
}

export function useAllSpace() {
    const [spaces, setSpaces] = useState<ISpace[] | null>(null);
    const { data, isLoading, refetch } = useQueryApi<ISpace[]>('/space');

    useEffect(() => {
        if (!data) {
            setSpaces(null);
            return;
        }

        setSpaces(data);
    }, [data])

    return { spaces, isLoading, refetch };
}