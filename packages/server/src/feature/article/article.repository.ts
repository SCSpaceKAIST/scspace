import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {
    schema,
    Notice as Article,
    User,
} from '@schema';
import {
    eq,
    and,
    SQL,
    desc,
    or,
    count,
    asc,
    like,
    gte,
} from 'drizzle-orm';
import {
    IArticleCreate,
    IArticleUpdate,
    IArticleQuery,
    IArticle,
    IArticleWithUser,
} from '@scspace-depot/types/article';
import { getNow } from '@scspace-server/common/utils';
import { ArticleStateEnum, ArticleTypeEnum } from '@scspace-depot/enums/article.enum';

@Injectable()
export class ArticleRepository {
    constructor(
        @Inject(DBAsyncProvider)
        private readonly db: MySql2Database<typeof schema>,
    ) { }

    async createArticle(articleData: IArticleCreate): Promise<IArticle> {
        const now = getNow();

        const [insertResult] = await this.db
            .insert(Article)
            .values({
                ...articleData,
                timePost: now,
                timeUpdate: now,
                state: ArticleStateEnum.HIDE, // visible by default
                type: articleData.type || ArticleTypeEnum.NOTICE, // general type by default
            });

        const articleId = insertResult.insertId;
        return await this.getArticleById(articleId);
    }

    async getArticleById(id: number): Promise<IArticle> {
        const [article] = await this.db
            .select()
            .from(Article)
            .where(eq(Article.id, id));

        if (!article) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }

        return article;
    }

    async getArticleWithUserById(id: number): Promise<IArticleWithUser> {
        const [result] = await this.db
            .select({
                article: Article,
                user: User,
            })
            .from(Article)
            .leftJoin(User, eq(Article.userId, User.id))
            .where(eq(Article.id, id));

        if (!result) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }

        return {
            ...result.article,
            user: result.user,
        };
    }

    async getArticles(query: IArticleQuery = {}): Promise<{
        articles: IArticleWithUser[];
        total: number;
    }> {
        const conditions: SQL[] = [];

        // Build where conditions
        if (query.userId !== undefined) {
            conditions.push(eq(Article.userId, query.userId));
        }
        if (query.state !== undefined) {
            conditions.push(gte(Article.state, query.state));
        }
        if (query.type !== undefined) {
            conditions.push(eq(Article.type, query.type));
        }
        if (query.search) {
            conditions.push(
                or(
                    like(Article.title, `%${query.search}%`),
                    like(Article.content, `%${query.search}%`)
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Get total count
        const [totalResult] = await this.db
            .select({ count: count() })
            .from(Article)
            .where(whereClause);

        // Build order by clause
        let orderBy;
        const direction = query.orderDirection === 'asc' ? asc : desc;

        switch (query.orderBy) {
            case 'title':
                orderBy = direction(Article.title);
                break;
            case 'timePost':
                orderBy = direction(Article.timePost);
                break;
            case 'timeUpdate':
            default:
                orderBy = direction(Article.timeUpdate);
                break;
        }

        // Get articles with user info
        const articles = await this.db
            .select({
                article: Article,
                user: User,
            })
            .from(Article)
            .leftJoin(User, eq(Article.userId, User.id))
            .where(whereClause)
            .orderBy(orderBy)
            .limit(query.limit || 20)
            .offset(query.offset || 0);

        return {
            articles: articles.map(result => ({
                ...result.article,
                user: result.user,
            })),
            total: totalResult.count,
        };
    }

    async getArticlePreviewByType(type: ArticleTypeEnum): Promise<IArticleWithUser> {
        const [result] = await this.db
            .select({
                article: Article,
                user: User,
            })
            .from(Article)
            .leftJoin(User, eq(Article.userId, User.id))
            .where(and(
                eq(Article.type, type),
                eq(Article.state, ArticleStateEnum.FOR_ALL),
            ))
            .orderBy(desc(Article.timeUpdate))
            .limit(1);

        if (!result) {
            throw new NotFoundException(`No articles found for type ${type}`);
        }

        return {
            ...result.article,
            user: result.user,
        };
    }

    async updateArticle(id: number, updateData: IArticleUpdate): Promise<IArticle> {
        await this.getArticleById(id);

        await this.db
            .update(Article)
            .set({
                ...updateData,
                timeUpdate: getNow(),
            })
            .where(eq(Article.id, id));

        return await this.getArticleById(id);
    }

    async deleteArticle(id: number): Promise<void> {
        await this.getArticleById(id);

        await this.db
            .delete(Article)
            .where(eq(Article.id, id));
    }

    async getArticlesByUserId(userId: number, query: Omit<IArticleQuery, 'userId'> = {}): Promise<{
        articles: IArticle[];
        total: number;
    }> {
        const result = await this.getArticles({ ...query, userId });
        return {
            articles: result.articles,
            total: result.total,
        };
    }

    async setArticleState(id: number, state: ArticleStateEnum): Promise<IArticle> {
        return await this.updateArticle(id, { state });
    }
}
