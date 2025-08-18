"use client"

import {
    IOrganization,
    IOrganizationAll,
    IOrganizationCreate,
    IOrganizationDelegator,
    IOrganizationMember,
    IOrganizationUpdateDelegator,
    IOrganizationUser,
} from "@scspace-depot/types/organization";
import { useMutationApi, useQueryApi } from "./api";
import { ISuccessResponse } from "@scspace-depot/types/common/common.type";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";

// 통합 Organization API Hook
export function useOrganizationAPI(params?: { id?: number; uid?: number }) {
    const id = params?.id ?? 0;
    const uid = params?.uid ?? 0;

    // GET Hook들을 최상위에서 호출
    const allOrganizations = useQueryApi<IOrganizationDelegator[]>("/organization/");
    const verifiedOrganizations = useQueryApi<IOrganizationDelegator[]>("/organization/verified/");
    const userOrganizations = useQueryApi<IOrganizationDelegator[]>(`/organization/user/${uid}`);
    const organizationDetail = useQueryApi<IOrganizationAll>(`/organization/${id}`);

    // POST/PUT/DELETE 메서드들
    const createOrg = useMutationApi<IOrganization, IOrganizationCreate>(
        "/organization/",
        "POST"
    ).mutateAsync;

    const updateOrg = useMutationApi<IOrganization, IOrganizationUpdateDelegator>(
        `/organization/${id || ''}`,
        "PUT"
    ).mutate;

    const addMember = useMutationApi<IOrganizationMember, IOrganizationUser>(
        `/organization/member/${id || ''}`,
        "POST"
    ).mutate;

    const deleteMember = useMutationApi<ISuccessResponse, IOrganizationUser>(
        `/organization/member/${id || ''}`,
        "DELETE"
    ).mutate;

    const deleteOrg = useMutationApi<ISuccessResponse, {}>(
        `/organization/${id || ''}`,
        "DELETE"
    ).mutate;

    const requestVerification = useMutationApi<IOrganization, {}>(
        `/organization/verify/${id || ''}`,
        "PUT"
    ).mutate;

    const updateStatus = useMutationApi<IOrganization, { status: OrganizationStatusEnum }>(
        `/organization/status/${id || ''}`,
        "PUT"
    ).mutate;

    const updateDelegator = useMutationApi<IOrganization, { delegatorId: number }>(
        `/organization/delegator/${id || ''}`,
        "PUT"
    ).mutate;

    // 유틸리티 함수
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

    return {
        // GET 데이터와 상태들
        allOrganizations,
        verifiedOrganizations,
        userOrganizations,
        organizationDetail,

        // CUD 메서드들
        createOrg,
        updateOrg,
        deleteOrg,

        // 멤버 관리
        member: {
            addMember,
            deleteMember,
            updateDelegator,
        },

        // 상태 관리
        status: {
            getOrganizationStatusCode,
            requestVerification,
            updateStatus,
        }
    };
}