import { Controller, Logger, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { fileStorage } from "./upload.storage";

@Controller("upload")
export class UploadController {
    @Post("file")
    @UseInterceptors(FilesInterceptor('files', 10, { storage: fileStorage }))
    uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        Logger.log(files);
    }
}