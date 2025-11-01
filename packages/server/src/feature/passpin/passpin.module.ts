import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { SpaceModule } from 'src/feature/space/space.module';
import { UserModule } from 'src/feature/user/user.module';
import { OrganizationModule } from 'src/feature/organization/organization.module';
import { PasspinController } from "./passpin.controller";
import { PasspinService } from "./passpin.service";
import { PasspinRepository } from "@scspace-server/feature/passpin/passpin.repository";
import { PasspinUtils } from './passpin.utils';

@Module({
    imports: [
        DBModule,
        SpaceModule,
        UserModule,
        OrganizationModule,
    ],
    controllers: [PasspinController],
    providers: [
        PasspinService,
        PasspinRepository,
        PasspinUtils,
    ],
    exports: [PasspinService],
})
export class PasspinModule { }