"use client"

import { IDeleteOrganization, IOrganization, IOrganizationCreate, IOrganizationMember, IOrganizationResponse, IOrganizationUser } from "@scspace-depot/types/organization";
import { useEffect, useState } from "react";
import { useMutationApi, useQueryApi } from "./useAPI";

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

export function useOrganizationAPI(oid?: { id: number }) {
    const id = oid?.id ?? null;

    const newOrg = useMutationApi<IOrganization, IOrganizationCreate>(
        "/organization/",
        "POST"
    );
    const generateOrg = newOrg.mutate;

    const delOrg = useMutationApi<void, IDeleteOrganization>(
        `/organization/${id}`,
        "DELETE"
    );
    const deleteOrg = delOrg.mutate;

    const rmvOrgMember = useMutationApi<boolean, IOrganizationUser>(
        `/organization/${id}/remove-member`,
        "PUT"
    );
    const removeMember = rmvOrgMember.mutate;

    const addOrgMember = useMutationApi<IOrganizationMember, IOrganizationUser>(
        `/organization/${id}/add-member`,
        "PUT"
    );
    const addMember = addOrgMember.mutate;

    return {
        generateOrg,
        deleteOrg,
        removeMember,
        addMember,
    };
}