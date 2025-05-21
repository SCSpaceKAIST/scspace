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
    }, [uid, data]);

    return { userInfo, isLoading, refetch };
}

export function useAllUser() {
    const { data, isLoading, refetch } = useQueryApi<IUser[]>(`/user/`);
    const [users, setUsers] = useState<IUser[] | null>(null);

    useEffect(() => {
        if (!data) {
            setUsers(null);
            return;
        }

        setUsers(data);
    }, [data]);

    return { users, isLoading, refetch };
}

export function useStudent({ studentNumber }: { studentNumber: string }) {
    const { data, isLoading, refetch } = useQueryApi<IUser>(`/user/studentNumber/${studentNumber}`);
    const [student, setStudent] = useState<IUser | null>(null);

    useEffect(() => {
        if (!data) {
            setStudent(null);
            return;
        }

        setStudent(data);
    }, [studentNumber, data]);

    return { student, isLoading, refetch };

}