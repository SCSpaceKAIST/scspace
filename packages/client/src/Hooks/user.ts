"use client"

import { IUser } from "@scspace-depot/types/user";
import { useQueryApi } from "./useAPI"

export function useUser() {
    const getUserInfo = ({ uid }: { uid: Number }) => {
        const { data, isLoading, refetch } = useQueryApi<IUser>(`/user/profile/${uid}`);

        while (isLoading);
        return data;
    };

    return { getUserInfo, };
}