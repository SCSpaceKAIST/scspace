import { IUser } from "../user";

export interface IArticle {
    id: number;
    userId: number;
    title: string;
    content: string | null;
    timePost: number;
    timeUpdate: number;
    state: number; // 0: hide, 1: show
    type: number; // article type
    images: string | null; // JSON string of image paths
    files: string | null; // JSON string of file paths
}

export interface IArticleCreate {
    userId: number;
    title: string;
    content?: string;
    type?: number;
    images?: string;
    files?: string;
}

export interface IArticleUpdate {
    title?: string;
    content?: string;
    state?: number;
    type?: number;
    images?: string;
    files?: string;
}

export interface IArticleQuery {
    userId?: number;
    state?: number;
    type?: number;
    search?: string; // for title/content search
    limit?: number;
    offset?: number;
    orderBy?: 'timePost' | 'timeUpdate' | 'title';
    orderDirection?: 'asc' | 'desc';
}

export interface IArticleWithUser extends IArticle {
    user: IUser;
}

// Article state constants
export const ARTICLE_STATE = {
    HIDDEN: 0,
    VISIBLE: 1,
} as const;

// Article type constants  
export const ARTICLE_TYPE = {
    GENERAL: 0,
    NOTICE: 1,
    ANNOUNCEMENT: 2,
    FAQ: 3,
} as const;
