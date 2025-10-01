import { BadRequestException, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';
import { ArticleController } from './article.controller';
import { DBModule } from 'src/db/db.module';
import { UserModule } from 'src/feature/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from '@scspace-server/tools/file/file.module';

@Module({
    imports: [
        DBModule,
        UserModule,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                dest: './uploads/article',
                limits: {
                    fileSize: 10 * 1024 * 1024, // 10MB
                    files: 20, // max 20 files (12 images + 8 files)
                },
                fileFilter: (req, file, cb) => {
                    // Allow images and common document types
                    const allowedMimes = [
                        'image/jpeg',
                        'image/jpg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'text/plain',
                    ];

                    if (allowedMimes.includes(file.mimetype)) {
                        cb(null, true);
                    } else {
                        cb(new BadRequestException('Invalid file type'), false);
                    }
                },
            }),
        }),
        FileModule,
    ],
    controllers: [ArticleController],
    providers: [
        ArticleRepository,
        ArticleService,
    ],
    exports: [ArticleService],
})
export class ArticleModule { }
