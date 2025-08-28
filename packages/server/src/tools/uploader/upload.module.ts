import { Module } from '@nestjs/common';
import * as fs from 'fs';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';

@Module({
    controllers: [UploadController],
    imports: [
        MulterModule.registerAsync({ // ① 이 부분에서 많이 헤맸다.
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                storage: diskStorage({
                    destination: (req, file, cb) => {
                        const dest = './src/files/upload/' // 나중에 변경! 환경변수로 해도 되고
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

                        cb(null, `${file.originalname}-${randNum}`) // ② NestJS: 파일 오류!!!!!!!
                    }
                })
            })
        })
    ]
})
export class UploadModule { }