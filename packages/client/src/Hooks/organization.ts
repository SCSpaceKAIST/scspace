"use client"

import { IOrganization, IOrganizationResponse } from "@scspace-depot/types/organization";
import { useEffect, useState } from "react";
import { useQueryApi } from "./useAPI";

export function useOrganization({ uid }: { uid?: number }) {
    const [query, setQuery] = useState<string>("/organization/");
    const [organization, setOrganization] = useState<IOrganization[] | null>(null);

    const { data, isLoading, refetch } = useQueryApi<IOrganization[]>(query);

    useEffect(() => {
        if (uid) setQuery(`/organization/user/${uid}`);
        else setQuery("/organization")
    }, [uid])

    useEffect(() => {
        if (!data) {
            setOrganization(null);
            return;
        }

        setOrganization(data);
    }, [data])

    return { organization, isLoading, refetch };
}

export function useOrganizationDetail({ id }: { id: number }) {
    const [organizationDetail, setOrganizationDetail] = useState<IOrganizationResponse | null>(null);

    const { data, isLoading, refetch } = useQueryApi<IOrganizationResponse>(`/organization/${id}`);

    useEffect(() => {
        if (!data) {
            setOrganizationDetail(null);
            return;
        }

        setOrganizationDetail(data);
    }, [data])

    return { organizationDetail, isLoading, refetch };

}