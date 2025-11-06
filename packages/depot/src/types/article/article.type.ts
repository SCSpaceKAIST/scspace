import { ArticleStateEnum, ArticleTypeEnum } from "../../enums/article.enum";
import { IUser } from "../user";

export interface IArticle {
    id: number;
    userId: number;
    title: string;
    content: string | null;
    timePost: number;
    timeUpdate: number;
    state: ArticleStateEnum; // article visibility state
    type: ArticleTypeEnum; // article type
    images: string | null; // JSON string of image paths
    files: string | null; // JSON string of file paths
}

export interface IArticleCreate {
    userId: number;
    title: string;
    content: string;
    type: number;
    images?: string;
    files?: string;
    state: number;
}

export type IArticleUpdate = Partial<Omit<IArticleCreate, "id">>;

export interface IArticleQuery {
    userId?: number;
    state?: ArticleStateEnum;
    type?: ArticleTypeEnum;
    search?: string; // for title/content search
    limit?: number;
    offset?: number;
    orderBy?: 'timePost' | 'timeUpdate' | 'title';
    orderDirection?: 'asc' | 'desc';
}

export interface IArticleWithUser extends IArticle {
    user: IUser;
}
