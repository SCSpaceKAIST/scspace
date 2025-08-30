import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from './file.service';

@Module({
    controllers: [FileController],
    imports: [
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({})
        }),
    ],
    providers: [FileService],
    exports: [FileService]
})
export class FileModule { }