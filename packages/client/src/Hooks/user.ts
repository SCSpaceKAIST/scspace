"use client"

import { IUser, IUserUpdate } from "@scspace-depot/types/user";
import { useQueryApi, useMutationApi } from "./api"
import { useEffect, useState } from "react";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";

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

export function useAllUser(options: { studentNumberPrefix?: number } = {}) {
    const { data, isLoading, refetch } = useQueryApi<IUser[]>(
        `/user/all?studentNumberPrefix=${options.studentNumberPrefix ?? 20}`
    );
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

export function useUserAPI({ uid }: { uid: number }) {
    const updateUserType = useMutationApi<IUser, IUserUpdate>(
        `/user/${uid}`,
        "PATCH"
    ).mutate;

    return {
        updateUserType
    }
}