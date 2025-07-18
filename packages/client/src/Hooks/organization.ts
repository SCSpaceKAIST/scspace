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
import { useMutationApi, useQueryApi } from "./api";
import { ISuccessResponse } from "@scspace-depot/types/common/common.type";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";
import { MutationOptions } from "@tanstack/react-query";

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

export function useVerifiedOrganization() {
    const [organization, setOrganization] = useState<IOrganizationDelegator[] | null>(null);
    const { data, isLoading, refetch } = useQueryApi<IOrganizationDelegator[]>("/organization/verified/");

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
    const { data, isLoading, refetch } = useQueryApi<IOrganizationDelegator[]>(
        `/organization/user/${uid}`
    );

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

    const updateOrg = useMutationApi<IOrganization, IOrganizationUpdate>(
        `/organization/${id}`,
        "PUT"
    ).mutate;

    const addMember = useMutationApi<IOrganizationMember, IOrganizationUser>(
        `/organization/member/${id}`,
        "POST"
    ).mutate;

    const deleteMember = useMutationApi<ISuccessResponse, IOrganizationUser>(
        `/organization/member/${id}`,
        "DELETE"
    ).mutate;

    const deleteOrg = useMutationApi<ISuccessResponse, {}>(
        `/organization/${id}`,
        "DELETE"
    ).mutate;

    function getOrganizationStatusCode(status: OrganizationStatusEnum) {
        switch (status) {
            case OrganizationStatusEnum.REGISTER_REQUEST:
                return "Registration Requested";
            case OrganizationStatusEnum.REGISTERED:
                return "Registered";
            case OrganizationStatusEnum.VERIFY_REQUEST:
                return "Verification Requested";
            case OrganizationStatusEnum.VERIFIED:
                return "Verified";
            default:
                return "Rejected";
        }
    }

    const requestVerification = useMutationApi<IOrganization, {}>(
        `/organization/verify/${id}`,
        "PUT"
    ).mutate;

    const updateStatus = useMutationApi<IOrganization, { status: OrganizationStatusEnum }>(
        `/organization/status/${id}`,
        "PUT"
    ).mutate;

    return {
        createOrg,
        updateOrg,
        deleteOrg,
        deleteMember,
        addMember,
        status: {
            getOrganizationStatusCode,
            requestVerification,
            updateStatus,
        }
    };
}