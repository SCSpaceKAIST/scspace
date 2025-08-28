import { Controller, Logger, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("upload")
export class UploadController {
    @Post("file")
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        Logger.log(files);
    }
}