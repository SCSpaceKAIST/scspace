import { Module } from '@nestjs/common';
import * as fs from 'fs';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { FileService } from './file.service';

@Module({
    controllers: [FileController],
    imports: [
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                storage: diskStorage({
                    destination: (req, file, cb) => {
                        const dest = './src/uploads/';
                        if (!fs.existsSync(dest)) {
                            fs.mkdirSync(dest, { recursive: true })
                        }

                        cb(null, dest);
                    },
                    filename: (req, file, cb) => {
                        const randNum = Array(8)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('')

                        cb(null, `${file.originalname}-${randNum}`);
                    }
                })
            })
        }),
    ],
    providers: [FileService],
    exports: [FileService]
})
export class FileModule { }