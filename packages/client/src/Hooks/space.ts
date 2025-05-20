"use client"

import { ISpace } from "@scspace-depot/types/space";
import { useQueryApi } from "./useAPI";
import { useEffect, useState } from "react";

export function useSpace(sid?: { id: number }) {
    const id = sid?.id ?? 0;

    const [query, setQuery] = useState<string>("/space/all");
    const [space, setSpace] = useState<ISpace[] | ISpace | null>(null);

    const { data, isLoading, refetch } = useQueryApi<ISpace[] | ISpace>(query);

    useEffect(() => {
        if (id) setQuery(`/space/${id}`);
        else setQuery("/space/all");
    }, [id])

    useEffect(() => {
        if (!data) {
            setSpace(null);
            return;
        }

        setSpace(data);
    }, [data])

    return { space, isLoading, refetch };
}