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
    Request,
    HttpCode,
    HttpStatus,
    UseInterceptors,
    UploadedFiles,
    Res,
    BadRequestException,
    Logger,
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
import { PUBLIC_FOLDER } from '@scspace-depot/consts/file.const';
import { FileService } from '@scspace-server/tools/file/file.service';
import { Response } from 'express';

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
        @Request() req: any,
        @Body() createData: Omit<IArticleCreate, 'userId' | 'images' | 'files'>,
        @UploadedFiles() files: { images?: Express.Multer.File[], files?: Express.Multer.File[] }
    ) {
        const userId = req.user.id;

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
    async getArticles(@Query() query: IArticleQuery) {
        return await this.articleService.getPublicArticles(query);
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
    async getMyArticles(@Request() req: any, @Query() query: Omit<IArticleQuery, 'userId'>) {
        const userId = req.user.id;
        return await this.articleService.getUserArticles(userId, query);
    }

    @Get(':id')
    async getArticleById(@Param('id', ParseIntPipe) id: number) {
        return await this.articleService.getArticleById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'images', maxCount: 10 },
            { name: 'files', maxCount: 5 },
        ])
    )
    async updateArticle(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any,
        @Body() updateData: Omit<IArticleUpdate, 'images' | 'files'>,
        @UploadedFiles() files: { images?: Express.Multer.File[], files?: Express.Multer.File[] }
    ) {
        const userId = req.user.id;
        const isAdmin = req.user.type >= 3; // Assuming admin type is 3 or higher

        // Handle uploaded files if provided
        const articleUpdate: IArticleUpdate = { ...updateData };

        if (files?.images) {
            articleUpdate.images = JSON.stringify(files.images.map(f => f.filename));
        }

        if (files?.files) {
            articleUpdate.files = JSON.stringify(files.files.map(f => f.filename));
        }

        return await this.articleService.updateArticle(id, userId, articleUpdate, isAdmin);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteArticle(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        const userId = req.user.id;
        const isAdmin = req.user.type >= 3; // Assuming admin type is 3 or higher

        await this.articleService.deleteArticle(id, userId, isAdmin);
    }

    @Put(':id/hide')
    @UseGuards(AuthGuard('jwt'))
    async hideArticle(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        const userId = req.user.id;
        const isAdmin = req.user.type >= 3;

        return await this.articleService.hideArticle(id, userId, isAdmin);
    }

    @Put(':id/show')
    @UseGuards(AuthGuard('jwt'))
    async showArticle(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        const userId = req.user.id;
        const isAdmin = req.user.type >= 3;

        return await this.articleService.showArticle(id, userId, isAdmin);
    }

    // Admin-only endpoints
    @Get('admin/all')
    @UseGuards(AuthGuard('jwt'))
    async getAllArticlesForAdmin(@Request() req: any, @Query() query: IArticleQuery) {
        const isAdmin = req.user.type >= 3;
        if (!isAdmin) {
            throw new Error('Admin access required');
        }

        return await this.articleService.getArticles(query);
    }
}