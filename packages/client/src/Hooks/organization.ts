"use client"

import { IOrganization, IOrganizationMember } from "@scspace-depot/types/organization";
import { useEffect, useState } from "react";
import { useQueryApi } from "./useAPI";

export function useOrganization({ id, uid }: { id?: number; uid?: number }) {
    const [query, setQuery] = useState<string>("/organization/");
    const [organization, setOrganization] = useState<IOrganization[] | IOrganization | null>(null);

    const { data, isLoading, refetch } = useQueryApi<IOrganization[] | IOrganization>(query);

    useEffect(() => {
        if (id) setQuery(`/organization/${id}`);
        else if (uid) setQuery(`/organization/user/${uid}`);
        else setQuery("/organization")
    }, [id, uid])

    useEffect(() => {
        if (!data) {
            setOrganization(null);
            return;
        }

        setOrganization(data);
    }, [data])

    return { organization, isLoading, refetch };
}