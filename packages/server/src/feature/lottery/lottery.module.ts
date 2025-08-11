import { Module } from "@nestjs/common";
import { LotterySeminarModule } from "./seminar/lottery.seminar.module";

@Module({
    imports: [LotterySeminarModule],
    exports: [LotterySeminarModule]
})

export class LotteryModule { }