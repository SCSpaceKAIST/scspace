import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import * as fs from 'fs';

@Injectable()
export class FileService {
    constructor() { }

    async fileExistValidator(filePath: string) {
        if (!fs.existsSync(filePath)) {
            Logger.log("Not found")
            throw new NotFoundException("File does not exits");
        }
    }

    async deleteFile(filePath: string) {
        this.fileExistValidator(filePath);

        fs.unlinkSync(filePath);
    }
}