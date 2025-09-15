"use client"

import { useFormDataMutation, useMutationApi, useQueryApi } from "./api";
import {
    IArticle,
    IArticleQuery,
    IArticleWithUser,
} from "@scspace-depot/types/article";

// 통합 Article API Hook
export function useArticleAPI(params?: {
    id?: number;
    query?: IArticleQuery;
}) {
    const { id, query } = params || {};

    // GET Hook들을 최상위에서 호출
    const articles = useQueryApi<{
        articles: IArticleWithUser[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>(
        "/article",
        query
    );

    const articleById = useQueryApi<IArticleWithUser>(
        (id && id > 0) ? `/article/${id}` : ""
    );

    const myArticles = useQueryApi<{
        articles: IArticle[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>(
        "/article/my",
        query
    );

    // POST/PUT/DELETE 메서드들
    const createArticle = useFormDataMutation<IArticle>(
        "/article",
        "POST"
    ).mutateAsync;

    const updateArticle = useFormDataMutation<IArticle>(
        id ? `/article/${id}` : "",
        "PUT"
    ).mutateAsync;

    const deleteArticle = useMutationApi<{}, {}>(
        id ? `/article/${id}` : "",
        "DELETE"
    ).mutateAsync;

    const hideArticle = useMutationApi<IArticle, {}>(
        id ? `/article/${id}/hide` : "",
        "PUT"
    ).mutateAsync;

    const showArticle = useMutationApi<IArticle, {}>(
        id ? `/article/${id}/show` : "",
        "PUT"
    ).mutateAsync;

    return {
        // GET 데이터와 상태들
        articles,
        articleById,
        myArticles,

        // CUD 메서드들
        createArticle,
        updateArticle,
        deleteArticle,
        hideArticle,
        showArticle,
    };
}

// // 검색 전용 Hook
// export function useArticleSearch(searchTerm?: string, query?: Omit<IArticleQuery, 'search'>) {
//     const searchResults = useQueryApi<{
//         articles: IArticleWithUser[];
//         total: number;
//         page: number;
//         limit: number;
//         totalPages: number;
//     }>(
//         searchTerm ? "/article/search" : "",
//         searchTerm ? { q: searchTerm, ...query } : undefined
//     );

//     return {
//         searchResults,
//     };
// }

// // 타입별 조회 Hook
// export function useArticlesByType(type?: number, query?: Omit<IArticleQuery, 'type'>) {
//     const articlesByType = useQueryApi<{
//         articles: IArticleWithUser[];
//         total: number;
//         page: number;
//         limit: number;
//         totalPages: number;
//     }>(
//         type !== undefined ? `/article/type/${type}` : "",
//         query
//     );

//     return {
//         articlesByType,
//     };
// }

// // 관리자 전용 Hook
// export function useArticleAdmin(query?: IArticleQuery) {
//     const allArticlesForAdmin = useQueryApi<{
//         articles: IArticleWithUser[];
//         total: number;
//         page: number;
//         limit: number;
//         totalPages: number;
//     }>(
//         "/article/admin/all",
//         query
//     );

//     return {
//         allArticlesForAdmin,
//     };
// }

// // 개별 기능별 Hook들
// export function useCreateArticle() {
//     return useFormDataMutation<IArticle>(
//         "/article",
//         "POST"
//     );
// }

// export function useUpdateArticle(id: number) {
//     return useFormDataMutation<IArticle>(
//         `/article/${id}`,
//         "PUT"
//     );
// }

// export function useDeleteArticle(id: number) {
//     return useMutationApi<void, {}>(
//         `/article/${id}`,
//         "DELETE"
//     );
// }

// export function useArticleVisibility(id: number) {
//     const hideArticle = useMutationApi<IArticle, {}>(
//         `/article/${id}/hide`,
//         "PUT"
//     );

//     const showArticle = useMutationApi<IArticle, {}>(
//         `/article/${id}/show`,
//         "PUT"
//     );

//     return {
//         hideArticle,
//         showArticle,
//     };
// }

// // 편의 Hook들
// export function useArticleDetail(id: number) {
//     return useQueryApi<IArticleWithUser>(
//         `/article/${id}`
//     );
// }

// export function usePublicArticles(query?: IArticleQuery) {
//     return useQueryApi<{
//         articles: IArticleWithUser[];
//         total: number;
//         page: number;
//         limit: number;
//         totalPages: number;
//     }>(
//         "/article",
//         query
//     );
// }

// export function useMyArticleList(query?: Omit<IArticleQuery, 'userId'>) {
//     return useQueryApi<{
//         articles: IArticle[];
//         total: number;
//         page: number;
//         limit: number;
//         totalPages: number;
//     }>(
//         "/article/my",
//         query
//     );
// }
