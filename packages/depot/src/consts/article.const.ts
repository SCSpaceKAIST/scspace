import { ArticleTypeEnum } from "../enums/article.enum";

export const ArticleTypeString: {
    [key in ArticleTypeEnum]: string;
} = {
    [ArticleTypeEnum.NOTICE]: "Notice",
    [ArticleTypeEnum.BUSINESS]: "Business",
    [ArticleTypeEnum.PROMOTION]: "Promotion"
};
