import { PdfService } from "@scspace-server/tools/pdf/pdf.service";
import { BadRequestException, Body, Controller, Get, Logger, Post, Query, Req, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { PRIVATE_FOLDER } from "@scspace-depot/consts/file.const";

@Controller('pdf')
export class PdfController {
    constructor(
        private readonly pdfService : PdfService
    ) {

        //super amazing codes

    }
}