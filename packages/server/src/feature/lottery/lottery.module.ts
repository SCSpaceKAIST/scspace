import { Module } from "@nestjs/common";
import { LotterySeminarModule } from "./seminar/lottery.seminar.module";
import { LotteryPerformanceModule } from "./performance/lottery.performance.module";

@Module({
    imports: [LotterySeminarModule, LotteryPerformanceModule],
    exports: [LotterySeminarModule, LotteryPerformanceModule]
})

export class LotteryModule { }