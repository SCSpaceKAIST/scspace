"use client"

import { ReservationStateEnum } from "@scspace-depot/enums/reservation.enum";
import { useMutationApi, useQueryApi } from "./useAPI"
import { IReservation, IReservationAll, IReservationCreate, IReservationUpdate } from "@scspace-depot/types/reservation"
import { useEffect, useState } from "react";
import { ISuccessResponse } from "@scspace-depot/types/common/common.type";

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function useReservations({ spaceId, dateFrom, dateTo }: {
    spaceId: number;
    dateFrom: Date;
    dateTo: Date;
}) {
    const { data, isLoading, refetch } = useQueryApi<IReservationAll[]>(`/reservation/space?spaceId=${spaceId}&timeFrom=${formatDate(dateFrom)}&timeTo=${formatDate(dateTo)}`);

    const [reservations, setReservations] = useState<IReservationAll[] | null>(null);

    useEffect(() => {
        if (!data) {
            setReservations(null);
            return;
        }
        setReservations(data);
    }, [data, spaceId, dateFrom.getTime(), dateTo.getTime()]);

    return { reservations, isLoading, refetch };
}

export interface IRes {
    id: number;
    name: string;
    title: string;
    hourFrom: number;
    hourTo: number;
    state: ReservationStateEnum;
}

export interface IReservationHookRes {
    [key: string]: IRes[]
}

function format({ d, hF, hT }: { d: IReservationAll; hF: number; hT: number }): IRes {
    return {
        id: d.id,
        name: (d.organizationId === 1) ? d.user.nameKr : d.organization.name,
        title: d.title,
        hourFrom: hF,
        hourTo: hT,
        state: d.state,
    };
}

export function useDateReservations({ spaceId, dateFrom, dateTo, }: {
    spaceId: number;
    dateFrom: Date;
    dateTo: Date;
}) {
    const { reservations, isLoading, refetch } = useReservations({ spaceId, dateFrom, dateTo });

    useEffect(() => { refetch() }, [spaceId, dateFrom.getTime(), dateTo.getTime()]);

    const [dateReservation, setReservation] = useState<IReservationHookRes>({});

    useEffect(() => {
        if (!reservations) {
            setReservation({});
            return;
        }

        const _reservation: IReservationHookRes = {};
        for (
            let temp = new Date(dateFrom.toDateString());
            temp <= dateTo;
            temp.setDate(temp.getDate() + 1)
        ) {
            _reservation[temp.toLocaleDateString()] = [];
        }

        reservations.map((d) => {
            const tF = new Date(d.timeFrom);
            const tT = new Date(d.timeTo);

            const dF = tF.toLocaleDateString();
            const dT = tT.toLocaleDateString();

            if (dF === dT) {
                _reservation[dF].push(format({ d: d, hF: tF.getHours(), hT: tT.getHours() }));
            } else {
                if (tF.getDate() >= dateFrom.getDate()) {
                    _reservation[dF].push(format({ d: d, hF: tF.getHours(), hT: 24 }));
                }
                if (tT.getDate() <= dateTo.getDate()) {
                    _reservation[dT].push(format({ d: d, hF: 0, hT: tT.getHours() }));
                }

                let _temp = new Date(tF.toDateString());
                _temp.setDate(_temp.getDate() + 1);

                while (_temp < tT) {
                    const midKey = _temp.toLocaleDateString();
                    if (_reservation[midKey]) _reservation[midKey].push(format({ d, hF: 0, hT: 24 }));
                    _temp.setDate(_temp.getDate() + 1);
                }
            }
        });

        setReservation(_reservation);
    }, [reservations]);

    return { dateReservation, isLoading, refetch };
};

export function useUserReservation({ uid }: { uid: number; }) {
    const { data, isLoading, refetch } = useQueryApi<IReservationAll[]>(`/reservation/user/${uid}`);
    const [userReservation, setUserReservation] = useState<IReservationAll[]>([]);

    useEffect(() => {
        if (!data) {
            setUserReservation([]);
            return;
        }
        setUserReservation(data);
    }, [data, uid]);

    return { userReservation, isLoading, refetch };
};

export function useWaitReservations() {
    const { data, isLoading, refetch } = useQueryApi<IReservationAll[]>(`/reservation/manage`);
    const [waitReservation, setWaitReservation] = useState<IReservationAll[]>([]);

    useEffect(() => {
        if (!data) {
            setWaitReservation([]);
            return;
        }
        setWaitReservation(data);
    }, [data]);

    return { waitReservation, isLoading, refetch };
}

export function useReservationAPI(Rid?: { rid: number }) {
    const rid = Rid?.rid ?? 0;

    const createRes = useMutationApi<IReservation, IReservationCreate>(
        "/reservation/",
        "POST"
    ).mutateAsync;

    const updateRes = useMutationApi<IReservation, IReservationUpdate>(
        `/reservation/${rid}`,
        "PUT"
    ).mutate;

    const deleteRes = useMutationApi<ISuccessResponse, {}>(
        `/reservation/${rid}`,
        "DELETE"
    ).mutate;

    return { createRes, updateRes, deleteRes };
};