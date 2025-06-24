"use client"

import { ReservationStateEnum } from "@scspace-depot/enums/reservation.enum";
import { useMutationApi, useQueryApi } from "./api"
import { IReservation, IReservationAll, IReservationCreate, IReservationUpdate } from "@scspace-depot/types/reservation"
import { useEffect, useState } from "react";
import { ISuccessResponse } from "@scspace-depot/types/common/common.type";
import { useDate } from "./utils";

export function useReservations({ spaceId, dateFrom, dateTo }: {
    spaceId: number;
    dateFrom: Date;
    dateTo: Date;
}) {
    const date2time = useDate().getTime

    const { data, isLoading, refetch } = useQueryApi<IReservationAll[]>(`/reservation/space?spaceId=${spaceId}&timeFrom=${date2time(dateFrom)}&timeTo=${date2time(dateTo)}`);

    const [reservations, setReservations] = useState<IReservationAll[] | null>(null);

    useEffect(() => {
        if (!data) {
            setReservations(null);
            return;
        }
        setReservations(data);
    }, [data]);

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

    const { getDate, getDateString, getTime } = useDate();

    useEffect(() => { refetch() }, [spaceId, dateFrom.getTime(), dateTo.getTime()]);

    const [dateReservation, setReservation] = useState<IReservationHookRes>({});

    useEffect(() => {
        if (!reservations) {
            setReservation({});
            return;
        }

        const _reservation: IReservationHookRes = {};
        for (
            let temp = new Date(dateFrom);
            temp <= dateTo;
            temp.setDate(temp.getDate() + 1)
        ) {
            _reservation[getDateString(getTime(temp))] = [];
        }

        reservations.map((d) => {
            const tF = getDate(d.timeFrom);
            const tT = getDate(d.timeTo);
            // tF.setHours(tF.getHours() + 9);
            // tT.setHours(tT.getHours() + 9);

            const dF = getDateString(d.timeFrom);
            const dT = getDateString(d.timeTo);

            if (dF === dT) {
                if (_reservation[dF]) _reservation[dF].push(format({ d: d, hF: tF.getHours(), hT: tT.getHours() }));
            } else {
                if (tF >= dateFrom) {
                    if (_reservation[dF]) _reservation[dF].push(format({ d: d, hF: tF.getHours(), hT: 24 }));
                }
                if (tT <= dateTo) {
                    if (_reservation[dT]) _reservation[dT].push(format({ d: d, hF: 0, hT: tT.getHours() }));
                }

                let _temp = new Date(tF);
                _temp.setDate(_temp.getDate() + 1);

                while (_temp < tT) {
                    const midKey = getDateString(getTime(_temp));
                    if (_reservation[midKey]) _reservation[midKey].push(format({ d, hF: 0, hT: 24 }));
                    _temp.setDate(_temp.getDate() + 1);
                }
            }
        });

        setReservation(_reservation);
    }, [reservations]);

    return { dateReservation, isLoading, refetch };
};

export function useUserReservation({ uid, oid, limit, offset }: {
    uid: number;
    oid: number;
    limit: number;
    offset: number;
}) {
    const {
        data: resData,
        isLoading: isResLoading,
        refetch: refetchRes
    } = useQueryApi<IReservationAll[]>(
        `/reservation/user?uid=${uid}&oid=${oid}&limit=${limit}&offset=${offset}`
    );
    const [userReservation, setUserReservation] = useState<IReservationAll[]>([]);

    const {
        data: countData,
        isLoading: isCountLoading,
        refetch: refetchCount
    } = useQueryApi<{ count: number }>(
        `/reservation/count?uid=${uid}`
    );
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (!resData) {
            setUserReservation([]);
            return;
        }
        setUserReservation(resData);
    }, [resData, uid]);

    useEffect(() => {
        if (!countData) {
            setCount(0);
            return;
        }
        setCount(countData.count);
    }, [countData, uid]);

    return {
        userReservation,
        count,
        isLoading: isResLoading || isCountLoading,
        refetch: () => {
            refetchRes();
            refetchCount();
        }
    };
};

export function useWaitReservations() {
    const { data, isLoading, refetch } = useQueryApi<IReservationAll[]>(
        `/reservation/manage`
    );
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