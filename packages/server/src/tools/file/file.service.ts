import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PRIVATE_FOLDER, PUBLIC_FOLDER } from "@scspace-depot/consts/file.const";
import * as fs from 'fs';

@Injectable()
export class FileService {
    constructor() { }

    async fileExistValidator(filePath: string) {
        const maxWaitTime = 5000;
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            if (fs.existsSync(filePath)) {
                Logger.log(`파일 존재 확인됨: ${filePath}`);
                return; // 파일이 존재함
            }
            // 파일이 아직 존재하지 않음, 50ms 기다린 후 다시 시도
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        throw new BadRequestException(`File save confirmation timed out: ${filePath}`);
    }

    async deletePublicFile(publicUri: string) {
        const filePath = `${PUBLIC_FOLDER}/${publicUri.split('/')[2] ?? publicUri}`;
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            // throw new NotFoundException(`File not found: ${filePath}`);
            Logger.log(`File not found: ${filePath}`);
        }
    }

    async deletePrivateFile(filename: string) {
        const filePath = `${PRIVATE_FOLDER}/${filename}`;
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            // throw new NotFoundException(`File not found: ${filePath}`);
            Logger.log(`File not found: ${filePath}`);
        }
    }
}