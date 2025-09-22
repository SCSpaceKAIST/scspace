import { forwardRef, Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { SpaceModule } from 'src/feature/space/space.module';
import { UserModule } from 'src/feature/user/user.module';
import { OrganizationModule } from 'src/feature/organization/organization.module';
import { PasspinController } from "@scspace-server/feature/passpin/passpin.controller";
import { PasspinService } from "@scspace-server/feature/passpin/passpin.service";

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
    ],
    exports: [PasspinService],
})
export class PasspinModule { }