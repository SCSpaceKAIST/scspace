"use client"

import { ReservationStateEnum } from "@scspace-depot/enums/reservation.enum";
import { useQueryApi } from "./useAPI"
import { IReservationResponse } from "@scspace-depot/types/reservation"
import { useEffect, useState } from "react";

export interface IRes {
    id: number;
    userId: number;
    organizationId: number;
    title: string;
    hourFrom: number;
    hourTo: number;
    state: ReservationStateEnum;
}

export interface IReservationHookRes {
    [key: string]: IRes[]
}

function format({ d, hF, hT }: { d: any; hF: number; hT: number }) {
    return {
        id: d.id,
        userId: d.userId,
        organizationId: d.organizationId,
        title: d.title,
        hourFrom: hF,
        hourTo: hT,
        state: d.state,
    };
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function useReservations({ spaceId, dateFrom, dateTo, }: {
    spaceId: number;
    dateFrom: Date;
    dateTo: Date;
}) {
    const { data, isLoading, refetch } = useQueryApi<IReservationResponse[]>(`/reservation/space?spaceId=${spaceId}&timeFrom=${formatDate(dateFrom)}&timeTo=${formatDate(dateTo)}`);

    const [reservation, setReservation] = useState<IReservationHookRes>({});

    useEffect(() => {
        if (!data) {
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

        console.log(_reservation);

        data.map((d) => {
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

                while (_temp.getDate() + 1 <= tT.getDate()) {
                    const midKey = _temp.toDateString();
                    _reservation[midKey].push(format({ d, hF: 0, hT: 24 }));
                    _temp.setDate(_temp.getDate() + 1);
                }
            }
        });

        setReservation(_reservation);
    }, [data, dateFrom.toDateString(), dateTo.toDateString(), spaceId]);

    return { reservation, isLoading, refetch };
};