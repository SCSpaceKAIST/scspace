"use client"

import { useMutationApi } from "@scspace-client/Hooks/useAPI";
import { IOrganization, IOrganizationCreate, IOrganizationMember } from "@scspace-depot/types/organization";
import { useEffect, useState } from "react";

export function addOrgMember({ id, uid }: { id: number; uid: number }) {
    const { status } = useMutationApi<IOrganizationMember, {}>(
        `/organization/${id}/add-member/${uid}`,
        "GET"
    );

    return { status };
}

export function rmvOrgMember({ id, uid }: { id: number; uid: number }) {
    const { status } = useMutationApi<boolean, {}>(
        `/organization/${id}/remove-member/${uid}`,
        "DELETE"
    );

    return { status };
}

export function deleteOrg({ id }: { id: number }) {
    const { status } = useMutationApi<void, {}>(
        `/organization/${id}`,
        "DELETE"
    );

    return { status };
}

export function newOrg(org: IOrganizationCreate) {
    const { status, mutate } = useMutationApi<IOrganization, IOrganizationCreate>(
        "/organization/",
        "POST"
    );

    useEffect(() => {
        mutate(org, {
            onSuccess: (d, v, c) => console.log('Success', d, v, c)
        });
    }, [org.delegatorId, org.name])

    return { status };
}