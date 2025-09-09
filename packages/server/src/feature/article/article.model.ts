import { IArticle, IArticleWithUser } from '@scspace-depot/types/article';
import { Notice as Article, schema, User } from '@schema';

export class MArticle implements IArticle {
    id: IArticle['id'];
    userId: IArticle['userId'];
    title: IArticle['title'];
    content: IArticle['content'];
    timePost: IArticle['timePost'];
    timeUpdate: IArticle['timeUpdate'];
    state: IArticle['state'];
    type: IArticle['type'];
    images: IArticle['images'];
    files: IArticle['files'];

    constructor(data: IArticle) {
        this.id = data.id;
        this.userId = data.userId;
        this.title = data.title;
        this.content = data.content;
        this.timePost = data.timePost;
        this.timeUpdate = data.timeUpdate;
        this.state = data.state;
        this.type = data.type;
        this.images = data.images;
        this.files = data.files;
    }

    static fromDB(article: typeof Article.$inferSelect): IArticle {
        return {
            id: article.id,
            userId: article.userId,
            title: article.title,
            content: article.content,
            timePost: article.timePost,
            timeUpdate: article.timeUpdate,
            state: article.state,
            type: article.type,
            images: article.images,
            files: article.files,
        };
    }
}

export class MArticleWithUser extends MArticle implements IArticleWithUser {
    user: IArticleWithUser['user'];

    constructor(data: IArticleWithUser) {
        super(data);
        this.user = data.user;
    }

    static fromDBWithUser(
        article: typeof Article.$inferSelect,
        user: typeof User.$inferSelect
    ): IArticleWithUser {
        return {
            ...MArticle.fromDB(article),
            user,
        };
    }
}
