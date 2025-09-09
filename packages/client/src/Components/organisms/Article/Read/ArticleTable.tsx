"use client"

import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { dateUtils } from "@scspace-client/Hooks/utils";
import { IArticleQuery, IArticleWithUser } from "@scspace-depot/types/article";

export default function ArticleTable(query: IArticleQuery) {
    const { data } = useArticleAPI({ query }).articles;
    const { getDateString } = dateUtils();

    return (
        <SimpleTable
            onIdChange={(id) => alert(`Selected Article ID: ${id}`)}
            header={["Id", "Title", "Author", "Created At"]}
            content={data?.articles?.map((article: IArticleWithUser) => ({
                id: article.id,
                row: [
                    article.id,
                    article.title,
                    article.user.nameKr || 'Unknown',
                    getDateString(article.timePost)
                ]
            })) ?? []}
        />
    );
}