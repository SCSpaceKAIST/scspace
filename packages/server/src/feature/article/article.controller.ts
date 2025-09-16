import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
    Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
    IArticleCreate,
    IArticleUpdate,
    IArticleQuery,
} from '@scspace-depot/types/article';
import { publicStorage } from '@scspace-server/tools/file/file.storage';
import { FileService } from '@scspace-server/tools/file/file.service';
import { ISuccessResponse } from '@scspace-depot/types/common';
import { Request } from 'express';
import { IUser } from '@scspace-depot/types/user';
import { UserTypeEnum } from '@scspace-depot/enums/user.enum';

@Controller('article')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly fileService: FileService
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'images', maxCount: 20 },
            { name: 'files', maxCount: 20 },
        ], {
            storage: publicStorage,
        })
    )
    async createArticle(
        @Req() req: Request,
        @Body() createData: Omit<IArticleCreate, 'userId' | 'images' | 'files'>,
        @UploadedFiles() files: { images?: Express.Multer.File[], files?: Express.Multer.File[] }
    ) {
        const user = req.user as IUser;
        const userId = user.id;

        // Handle uploaded files
        const imageData = files?.images ? JSON.stringify(files.images.map(f => f.filename)) : undefined;
        const fileData = files?.files ? JSON.stringify(files.files.map(f => f.filename)) : undefined;

        const articleData = {
            ...createData,
            images: imageData,
            files: fileData,
        };

        return await this.articleService.createArticle(userId, articleData);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getArticles(
        @Query() query: IArticleQuery,
        @Req() req: Request
    ) {
        const user = req.user as IUser;
        const isManager = user.type === UserTypeEnum.MANAGER || user.type === UserTypeEnum.ADMIN;

        if (!isManager) return await this.articleService.getPublicArticles(query);
        return await this.articleService.getArticles(query);
    }

    @Get('search')
    async searchArticles(
        @Query('q') searchTerm: string,
        @Query() query: Omit<IArticleQuery, 'search'>
    ) {
        return await this.articleService.searchArticles(searchTerm, query);
    }

    @Get('type/:type')
    async getArticlesByType(
        @Param('type', ParseIntPipe) type: number,
        @Query() query: Omit<IArticleQuery, 'type'>
    ) {
        return await this.articleService.getArticlesByType(type, query);
    }

    @Get('my')
    @UseGuards(AuthGuard('jwt'))
    async getMyArticles(@Req() req: any, @Query() query: Omit<IArticleQuery, 'userId'>) {
        const userId = req.user.id;
        return await this.articleService.getUserArticles(userId, query);
    }

    @Get(':id')
    async getArticleById(@Param('id', ParseIntPipe) id: number) {
        return await this.articleService.getArticleById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    // @UseInterceptors(
    //     FileFieldsInterceptor([
    //         { name: 'images', maxCount: 20 },
    //         { name: 'files', maxCount: 20 },
    //     ], {
    //         storage: publicStorage,
    //     })
    // )
    async updateArticle(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
        @Body() updateData: Omit<IArticleUpdate, 'images' | 'files'>,
        // @UploadedFiles() files: { images?: Express.Multer.File[], files?: Express.Multer.File[] }
    ) {
        const user = req.user as IUser;
        const userId = user.id;
        const isManager = user.type === UserTypeEnum.MANAGER || user.type === UserTypeEnum.ADMIN;

        // Handle uploaded files if provided
        // const articleUpdate: IArticleUpdate = { ...updateData };

        // if (files?.images) {
        //     articleUpdate.images = JSON.stringify(files.images.map(f => f.filename));
        // }

        // if (files?.files) {
        //     articleUpdate.files = JSON.stringify(files.files.map(f => f.filename));
        // }

        return await this.articleService.updateArticle(id, userId, updateData, isManager);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteArticle(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<ISuccessResponse> {
        const userId = req.user.id;
        const isAdmin = req.user.type >= 3; // Assuming admin type is 3 or higher

        await this.articleService.deleteArticle(id, userId, isAdmin);

        return { success: true };
    }

    @Put(':id/hide')
    @UseGuards(AuthGuard('jwt'))
    async hideArticle(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        const userId = req.user.id;
        const isAdmin = req.user.type >= 3;

        return await this.articleService.hideArticle(id, userId, isAdmin);
    }

    @Put(':id/show')
    @UseGuards(AuthGuard('jwt'))
    async showArticle(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        const userId = req.user.id;
        const isAdmin = req.user.type >= 3;

        return await this.articleService.showArticle(id, userId, isAdmin);
    }
}