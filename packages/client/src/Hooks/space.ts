"use client"

import { ISpace } from "@scspace-depot/types/space";
import { useQueryApi } from "./useAPI";

export function useSpace() {
    const getSpace = ({ id = -1 }: { id: number }) => {
        let query: string = "/space/all";
        if (id !== -1) query = `/space/${id}`;

        const { data, isLoading, refetch } = useQueryApi<ISpace[] | ISpace>(query);

        while (isLoading);
        return data;
    }

    return { getSpace };
}