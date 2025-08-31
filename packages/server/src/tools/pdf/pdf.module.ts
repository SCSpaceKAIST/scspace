import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PdfService } from './pdf.service';
import { FileModule } from "@scspace-server/tools/file/file.module";
import { DBModule } from "@scspace-server/db/db.module";
import { SpaceModule } from "@scspace-server/feature/space/space.module";
import { OrganizationModule } from "@scspace-server/feature/organization/organization.module";
import { UserModule } from "@scspace-server/feature/user/user.module";
import { MailModule } from "@scspace-server/tools/mailer/mail.module";

@Module({
    imports: [
        ConfigModule,
        FileModule,
        DBModule,
        SpaceModule,
        UserModule,
        OrganizationModule,
        MailModule
    ],
    controllers: [PdfController],
    providers: [PdfService],
    exports: [PdfService]
})


export class PdfModule {}