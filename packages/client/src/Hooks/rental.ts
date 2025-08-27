"use client"

import { useMutationApi, useQueryApi } from "./api";
import {
    IRental,
    IRentalAll,
    IRentalUpdate,
    IRentalReturn,
    IRentalConfirm,
    IGoods,
    IGoodsCreate,
    IGoodsUpdate,
    IGoodsAvailabilityCheck,
    IRentalCreateClient,
} from "@scspace-depot/types/rental";
import { IDataResponse, ISuccessResponse } from "@scspace-depot/types/common/common.type";

// 통합 Rental API Hook (대여 관리)
export function useRentalAPI(params?: {
    id?: number;
    userId?: number;
    limit?: number;
    offset?: number;
    isActive?: boolean;
}) {
    const { id, userId, limit = 50, offset = 0, isActive } = params || {
        id: -1,
        userId: -1,
        limit: 50,
        offset: 0,
        isActive: undefined
    };

    const activeParam = isActive !== undefined ? `&isActive=${isActive}` : '';

    // GET Hook들을 최상위에서 호출
    const allRentals = useQueryApi<IDataResponse<IRentalAll[]>>(
        `/rental?limit=${limit}&offset=${offset}`
    );

    const rentalById = useQueryApi<IRentalAll>(
        (id && id > 0) ? `/rental/${id}` : ""
    );

    const userRentals = useQueryApi<IDataResponse<IRentalAll[]>>(
        (userId && userId > 0) ? `/rental/user/${userId}?${activeParam}` : ""
    );

    const myRentals = useQueryApi<IDataResponse<IRentalAll[]>>(
        `/rental/my/list${activeParam ? `?${activeParam.slice(1)}` : ''}`
    );

    // POST/PUT/DELETE 메서드들
    const createRental = useMutationApi<{ success: boolean; data: { id: number } }, Omit<IRentalCreateClient, 'userId'>>(
        "/rental",
        "POST"
    ).mutateAsync;

    const updateRental = useMutationApi<ISuccessResponse, Omit<IRentalUpdate, 'id'>>(
        `/rental/${id || ''}`,
        "PUT"
    ).mutate;

    const returnRental = useMutationApi<ISuccessResponse, Omit<IRentalReturn, 'id'>>(
        `/rental/${id || ''}/return`,
        "PUT"
    ).mutate;

    const confirmReturn = useMutationApi<ISuccessResponse, Omit<IRentalConfirm, 'id'>>(
        `/rental/${id || ''}/confirm`,
        "PUT"
    ).mutate;

    return {
        // GET 데이터와 상태들
        allRentals,
        rentalById,
        userRentals,
        myRentals,

        // CUD 메서드들
        createRental,
        updateRental,
        returnRental,
        confirmReturn,
    };
}

// 통합 Goods API Hook (물품 관리)
export function useGoodsAPI(params?: {
    id?: number;
}) {
    const { id } = params || { id: -1 };

    // GET Hook들을 최상위에서 호출
    const allGoods = useQueryApi<IGoods[]>(
        `/rental/goods/list`
    );

    const goodsById = useQueryApi<IGoods>(
        (id && id > 0) ? `/rental/goods/${id}` : ""
    );

    // POST/PUT/DELETE 메서드들
    const createGoods = useMutationApi<{ success: boolean; data: { id: number } }, IGoodsCreate>(
        "/rental/goods",
        "POST"
    ).mutateAsync;

    const updateGoods = useMutationApi<ISuccessResponse, Omit<IGoodsUpdate, 'id'>>(
        `/rental/goods/${id || ''}`,
        "PUT"
    ).mutateAsync;

    const deleteGoods = useMutationApi<ISuccessResponse, {}>(
        `/rental/goods/${id || ''}`,
        "DELETE"
    ).mutateAsync;

    const checkAvailability = useMutationApi<{ available: boolean }, IGoodsAvailabilityCheck>(
        "/rental/goods/check-availability",
        "POST"
    ).mutate;

    return {
        // GET 데이터와 상태들
        allGoods,
        goodsById,

        // CUD 메서드들
        createGoods,
        updateGoods,
        deleteGoods,
        checkAvailability,
    };
}
