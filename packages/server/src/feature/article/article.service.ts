import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import {
    IArticleCreate,
    IArticleUpdate,
    IArticleQuery,
    IArticle,
    IArticleWithUser,
    ARTICLE_STATE,
    ARTICLE_TYPE,
} from '@scspace-depot/types/article';
import { FileService } from "@scspace-server/tools/file/file.service";

@Injectable()
export class ArticleService {
    constructor(
        private readonly articleRepository: ArticleRepository,
        private readonly fileService: FileService,
    ) { }

    async createArticle(userId: number, articleData: Omit<IArticleCreate, 'userId'>): Promise<IArticle> {
        const createData: IArticleCreate = {
            ...articleData,
            userId,
        };

        return await this.articleRepository.createArticle(createData);
    }

    async getArticleById(id: number): Promise<IArticleWithUser> {
        return await this.articleRepository.getArticleWithUserById(id);
    }

    async getArticles(query: IArticleQuery = {}): Promise<{
        articles: IArticleWithUser[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const limit = query.limit || 20;
        const offset = query.offset || 0;
        const page = Math.floor(offset / limit) + 1;

        const result = await this.articleRepository.getArticles(query);
        const totalPages = Math.ceil(result.total / limit);

        return {
            ...result,
            page,
            limit,
            totalPages,
        };
    }

    async getPublicArticles(query: Omit<IArticleQuery, 'state'> = {}): Promise<{
        articles: IArticleWithUser[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        // Only show visible articles for public access
        return await this.getArticles({ ...query, state: ARTICLE_STATE.VISIBLE });
    }

    async updateArticle(
        id: number,
        userId: number,
        updateData: IArticleUpdate,
        isAdmin: boolean = false
    ): Promise<IArticle> {
        const article = await this.articleRepository.getArticleById(id);

        // Check permission: only author or admin can update
        if (!isAdmin && article.userId !== userId) {
            throw new ForbiddenException('You can only update your own articles');
        }

        return await this.articleRepository.updateArticle(id, updateData);
    }

    async updateArticleFile(
        id: number,
        userId: number,
        updateData: Pick<IArticleUpdate, "images" | "files">,
        isAdmin: boolean = false
    ): Promise<IArticle> {
        const article = await this.articleRepository.getArticleById(id);

        // Check permission: only author or admin can update
        if (!isAdmin && article.userId !== userId) {
            throw new ForbiddenException('You can only update your own articles');
        }

        const currentImages = JSON.parse(article.images ?? "[]") ?? [];
        const currentFiles = JSON.parse(article.files ?? "[]") ?? [];

        const newImages = JSON.parse(updateData.images ?? "[]") ?? [];
        const newFiles = JSON.parse(updateData.files ?? "[]") ?? [];

        return await this.articleRepository.updateArticle(id, {
            images: JSON.stringify([...currentImages, ...newImages]),
            files: JSON.stringify([...currentFiles, ...newFiles]),
        });
    }

    //file deletion
    async deleteArticleFiles(id:number): Promise<void> {
        const article = await this.articleRepository.getArticleById(id);
        const currentImages = JSON.parse(article.images ?? "[]") ?? [];
        const currentFiles = JSON.parse(article.files ?? "[]") ?? [];

        const targets = Array.from(new Set([...currentImages, ...currentFiles]));

        for (const i of targets) {
            console.log(i);
            await this.fileService.deletePublicFile(i);
        }
    }

    async deleteArticle(id: number, userId: number, isAdmin: boolean = false): Promise<void> {
        const article = await this.articleRepository.getArticleById(id);

        // Check permission: only author or admin can delete
        if (!isAdmin && article.userId !== userId) {
            throw new ForbiddenException('You can only delete your own articles');
        }

        await this.deleteArticleFiles(id);
        await this.articleRepository.deleteArticle(id);
    }

    async getUserArticles(userId: number, query: Omit<IArticleQuery, 'userId'> = {}): Promise<{
        articles: IArticle[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const limit = query.limit || 20;
        const offset = query.offset || 0;
        const page = Math.floor(offset / limit) + 1;

        const result = await this.articleRepository.getArticlesByUserId(userId, query);
        const totalPages = Math.ceil(result.total / limit);

        return {
            ...result,
            page,
            limit,
            totalPages,
        };
    }

    async setArticleVisibility(id: number, userId: number, isVisible: boolean, isAdmin: boolean = false): Promise<IArticle> {
        const article = await this.articleRepository.getArticleById(id);

        // Check permission: only author or admin can hide
        if (!isAdmin && article.userId !== userId) {
            throw new ForbiddenException('You can only hide your own articles');
        }

        return await this.articleRepository.setArticleVisibility(id, isVisible);
    }

    async getArticlesByType(type: number, query: Omit<IArticleQuery, 'type'> = {}): Promise<{
        articles: IArticleWithUser[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        return await this.getArticles({ ...query, type });
    }

    async searchArticles(searchTerm: string, query: Omit<IArticleQuery, 'search'> = {}): Promise<{
        articles: IArticleWithUser[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        if (!searchTerm || searchTerm.trim().length === 0) {
            throw new BadRequestException('Search term cannot be empty');
        }

        return await this.getArticles({ ...query, search: searchTerm.trim() });
    }
}
