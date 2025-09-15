import { BadRequestException, Body, Controller, Get, Logger, Post, Query, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { privateStorage, publicStorage } from "./file.storage";
import { Response } from "express";
import { FileService } from "./file.service";
import { PRIVATE_FOLDER, PUBLIC_FOLDER } from "@scspace-depot/consts/file.const";
import { IFileUploadPublicResponse, IFileUploadResponse } from "@scspace-depot/types/file";
import { resolve } from "path";

@Controller("file")
export class FileController {
    constructor(
        private readonly fileService: FileService
    ) { }

    @Post("upload")
    @UseInterceptors(FilesInterceptor('files', 25, { storage: privateStorage }))
    async uploaFile(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: any
    ): Promise<IFileUploadResponse> {
        Logger.log(files, body);
        return {
            success: true,
            files: files.map(file => ({
                originalName: file.originalname,
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype
            }))
        };
    }

    @Post("upload/public")
    @UseInterceptors(FilesInterceptor('files', 25, { storage: publicStorage }))
    async uploadPublicFile(@UploadedFiles() files: Array<Express.Multer.File>): Promise<IFileUploadPublicResponse> {
        Logger.log(files);
        return {
            success: true,
            files: files.map(file => ({
                originalName: file.originalname,
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype,
                url: `/uploads/${file.filename}` // public 파일의 경우 접근 URL도 제공
            }))
        };
    }

    @Get("download")
    async downloadFile(
        @Res() res: Response,
        @Query("filename") file: string,
        @Query("displayName") dpName?: string,
        @Query("isPublic") isPublic?: boolean
    ) {
        const filePath = resolve(isPublic ? PUBLIC_FOLDER : PRIVATE_FOLDER, file);

        await this.fileService.fileExistValidator(filePath);

        res.download(filePath, dpName ?? file, (err) => {
            if (err) {
                Logger.error(`[downloadFile] Download error: ${err.message}`);
                throw new BadRequestException(`Error occured: ${err.message}`);
            } else {
                Logger.log(`[downloadFile] Download success: ${filePath}`);
            }
        });
    }
}