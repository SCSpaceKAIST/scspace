"use client"

import { IUser, IUserUpdate } from "@scspace-depot/types/user";
import { useQueryApi, useMutationApi } from "./api"
import { useEffect, useState } from "react";
import { UserUtils } from "@scspace-depot/utils/user.utils";

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
        `/user/all?studentNumberPrefix=${options.studentNumberPrefix ?? 0}`
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

    const getUserTypeCode = (type: number): string => {
        if (UserUtils.isAdmin(type))
            return "임원진/개발진";
        if (UserUtils.isManager(type))
            return "공간위원";
        if (UserUtils.isWorker(type))
            return "근로자";
        return "일반";
    }

    return {
        updateUserType,
        getUserTypeCode
    }
}
