import { forwardRef, Module } from "@nestjs/common";
import { DBModule } from "@scspace-server/db/db.module";
import { SpaceModule } from "../../space/space.module";
import { UserModule } from "../../user/user.module";
import { OrganizationModule } from "../../organization/organization.module";
import { LotteryPerformanceController } from "./lottery.performance.controller";
import { LotteryPerformanceRepository } from "./lottery.performance.repository";
import { LotteryPerformanceService } from "./lottery.performance.service";
import { LotteryPerformanceInfoRepository } from "./lottery.performance.info.repository";

@Module({
    imports: [
        DBModule,
        SpaceModule,
        UserModule,
        OrganizationModule,
    ],
    controllers: [LotteryPerformanceController],
    providers: [
        LotteryPerformanceRepository,
        LotteryPerformanceInfoRepository,
        LotteryPerformanceService
    ],
    exports: [LotteryPerformanceService],
})

export class LotteryPerformanceModule { }
