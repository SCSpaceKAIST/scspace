"use client"

import {
    IOrganization,
    IOrganizationAll,
    IOrganizationCreate,
    IOrganizationDelegator,
    IOrganizationMember,
    IOrganizationUpdate,
    IOrganizationUser,
} from "@scspace-depot/types/organization";
import { useEffect, useState } from "react";
import { useMutationApi, useQueryApi } from "./useAPI";
import { ISuccessResponse } from "@scspace-depot/types/common/common.type";

export function useAllOrganization() {
    const [organization, setOrganization] = useState<IOrganizationDelegator[] | null>(null);
    const { data, isLoading, refetch } = useQueryApi<IOrganizationDelegator[]>("/organization/");

    useEffect(() => {
        if (!data) {
            setOrganization(null);
            return;
        }

        setOrganization(data);
    }, [data])

    return { organization, isLoading, refetch };
}

export function useOrganization({ uid }: { uid?: number }) {
    const [organization, setOrganization] = useState<IOrganizationDelegator[] | null>(null);
    const { data, isLoading, refetch } = useQueryApi<IOrganizationDelegator[]>(`/organization/user/${uid}`);

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
    const [organizationDetail, setOrganizationDetail] = useState<IOrganizationAll | null>(null);
    const { data, isLoading, refetch } = useQueryApi<IOrganizationAll>(`/organization/${id}`);

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

    const postOrg = useMutationApi<IOrganization, IOrganizationCreate>(
        "/organization/",
        "POST"
    );
    const createOrg = postOrg.mutate;

    const putOrg = useMutationApi<IOrganization, IOrganizationCreate>(
        `/organization/${id}`,
        "PUT"
    );
    const updateOrg = putOrg.mutate;

    const addOrgMember = useMutationApi<IOrganizationMember, IOrganizationUser>(
        `/organization/${id}/add`,
        "PUT"
    );
    const addMember = addOrgMember.mutate;

    const rmvOrgMember = useMutationApi<ISuccessResponse, IOrganizationUser>(
        `/organization/${id}/delete`,
        "PUT"
    );
    const removeMember = rmvOrgMember.mutate;

    const delOrg = useMutationApi<IOrganization, {}>(
        `/organization/${id}`,
        "DELETE"
    );
    const deleteOrg = delOrg.mutate;

    return {
        createOrg,
        updateOrg,
        deleteOrg,
        removeMember,
        addMember,
    };
}