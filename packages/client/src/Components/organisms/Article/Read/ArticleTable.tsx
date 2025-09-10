"use client"

import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { dateUtils } from "@scspace-client/Hooks/utils";
import { IArticleQuery, IArticleWithUser } from "@scspace-depot/types/article";
import { useEffect } from "react";

export default function ArticleTable({ refetchTrigger, query }: {
    refetchTrigger: number;
    query: IArticleQuery
}) {
    const { data, refetch } = useArticleAPI({ query }).articles;
    const { getString } = dateUtils();

    useEffect(() => {
        refetch();
    }, [refetchTrigger]);

    const { linkPush } = useLinkPush();

    return (
        <SimpleTable
            onIdChange={(id) => linkPush(`/article/${id}`)}
            header={["Id", "Title", "Author", "Created At"]}
            content={data?.articles?.map((article: IArticleWithUser) => ({
                id: article.id,
                row: [
                    article.id,
                    article.title,
                    article.user.nameKr,
                    getString(article.timePost)
                ]
            })) ?? []}
        />
    );
}