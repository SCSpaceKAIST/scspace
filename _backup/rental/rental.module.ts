import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalRepository } from './rental.repository';
import { RentalPublicService } from './rental.public.service';
import { RentalController } from './rental.controller';
import { DBModule } from 'src/db/db.module';
import { UserModule } from 'src/feature/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from '@scspace-server/tools/file/file.module';
import { PdfModule } from "@scspace-server/tools/pdf/pdf.module";
import { MailModule } from "@scspace-server/tools/mailer/mail.module";

@Module({
    imports: [
        DBModule,
        UserModule,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({})
        }),
        FileModule,
        PdfModule,
        MailModule
    ],
    controllers: [RentalController],
    providers: [
        RentalRepository,
        RentalPublicService,
        RentalService,
    ],
    exports: [RentalPublicService],
})
export class RentalModule { }
