"use client"

import {
    IOrganization,
    IOrganizationAll,
    IOrganizationCreate,
    IOrganizationDelegator,
    IOrganizationMember,
    IOrganizationUser,
} from "@scspace-depot/types/organization";
import { useEffect, useState } from "react";
import { useMutationApi, useQueryApi } from "./api";
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

    const createOrg = useMutationApi<IOrganization, IOrganizationCreate>(
        "/organization/",
        "POST"
    ).mutate;

    const updateOrg = useMutationApi<IOrganization, IOrganizationCreate>(
        `/organization/${id}`,
        "PUT"
    ).mutate;

    const addMember = useMutationApi<IOrganizationMember, IOrganizationUser>(
        `/organization/${id}/add`,
        "PUT"
    ).mutate;

    const removeMember = useMutationApi<ISuccessResponse, IOrganizationUser>(
        `/organization/${id}/delete`,
        "PUT"
    ).mutate;

    const deleteOrg = useMutationApi<IOrganization, {}>(
        `/organization/${id}`,
        "DELETE"
    ).mutate;

    return {
        createOrg,
        updateOrg,
        deleteOrg,
        removeMember,
        addMember,
    };
}