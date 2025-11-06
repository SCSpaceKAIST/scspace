"use client"

import { useFormDataMutation, useMutationApi, useQueryApi } from "./api";
import {
    IArticle,
    IArticleQuery,
    IArticleUpdate,
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

    const updateArticle = useMutationApi<IArticle, IArticleUpdate>(
        id ? `/article/${id}` : "",
        "PUT"
    ).mutateAsync;

    const updateArticleFile = useFormDataMutation<IArticle>(
        id ? `/article/${id}/file` : "",
        "PUT"
    ).mutateAsync;

    const updateArticleState = useMutationApi<IArticle, Pick<IArticle, "state">>(
        id ? `/article/${id}/state` : "",
        "PUT"
    ).mutateAsync;

    const deleteArticle = useMutationApi<{}, {}>(
        id ? `/article/${id}` : "",
        "DELETE"
    ).mutateAsync;


    return {
        // GET 데이터와 상태들
        articles,
        articleById,
        myArticles,

        // CUD 메서드들
        createArticle,
        updateArticle,
        updateArticleFile,
        deleteArticle,
        updateArticleState,
    };
}
