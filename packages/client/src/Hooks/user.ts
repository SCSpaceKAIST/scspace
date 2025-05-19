"use client"

import { IUser } from "@scspace-depot/types/user";
import { useQueryApi } from "./useAPI"
import { useEffect, useState } from "react";

export function useUserInfo({ uid }: { uid: Number }) {
    const { data, isLoading, refetch } = useQueryApi<IUser>(`/user/profile/${uid}`);
    const [userInfo, setUserInfo] = useState<IUser | null>(null);

    useEffect(() => {
        if (!data) {
            setUserInfo(null);
            return;
        }

        setUserInfo(data);
    }, [uid]);

    return { userInfo, isLoading, refetch };
}