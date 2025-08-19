import { ILotteryInfo } from '@scspace-depot/types/lottery';
import { PerformanceLotteryInfo } from '@schema';

export class MPerformanceLotteryInfo implements ILotteryInfo {
    id: ILotteryInfo['id'];
    timeLotteryStart: ILotteryInfo['timeLotteryStart'];
    timeLotteryEnd: ILotteryInfo['timeLotteryEnd'];
    timeStart: ILotteryInfo['timeStart'];
    timeEnd: ILotteryInfo['timeEnd'];
    applied: ILotteryInfo['applied'];

    constructor(data: ILotteryInfo) {
        this.id = data.id;
        this.timeLotteryStart = data.timeLotteryStart;
        this.timeLotteryEnd = data.timeLotteryEnd;
        this.timeStart = data.timeStart;
        this.timeEnd = data.timeEnd;
        this.applied = data.applied;
    }

    static fromDB(lottery: typeof PerformanceLotteryInfo.$inferSelect): ILotteryInfo {
        return {
            id: lottery.id,
            timeLotteryStart: lottery.timeLotteryStart,
            timeLotteryEnd: lottery.timeLotteryEnd,
            timeStart: lottery.timeStart,
            timeEnd: lottery.timeEnd,
            applied: lottery.applied,
        };
    }
}