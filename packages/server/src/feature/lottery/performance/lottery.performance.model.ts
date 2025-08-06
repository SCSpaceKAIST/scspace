import { ILotteryInfo, IPerformanceLottery } from '@scspace-depot/types/lottery';
import { PerformanceLotteryInfo, PerformanceLottery } from '@schema';

export class MPerformanceLotteryInfo implements ILotteryInfo {
    id: ILotteryInfo['id'];
    timeLotteryStart: ILotteryInfo['timeLotteryStart'];
    timeLotteryEnd: ILotteryInfo['timeLotteryEnd'];
    timeStart: ILotteryInfo['timeStart'];
    timeEnd: ILotteryInfo['timeEnd'];

    constructor(data: ILotteryInfo) {
        this.id = data.id;
        this.timeLotteryStart = data.timeLotteryStart;
        this.timeLotteryEnd = data.timeLotteryEnd;
        this.timeStart = data.timeStart;
        this.timeEnd = data.timeEnd;
    }

    static fromDB(lottery: typeof PerformanceLotteryInfo.$inferSelect): ILotteryInfo {
        return {
            id: lottery.id,
            timeLotteryStart: lottery.timeLotteryStart,
            timeLotteryEnd: lottery.timeLotteryEnd,
            timeStart: lottery.timeStart,
            timeEnd: lottery.timeEnd,
        };
    }
}

export class MPerformanceLottery implements IPerformanceLottery {
    id: IPerformanceLottery['id'];
    infoId: IPerformanceLottery['infoId'];
    organizationId: IPerformanceLottery['organizationId'];
    spaceId: IPerformanceLottery['spaceId'];
    priority: IPerformanceLottery['priority'];
    date: IPerformanceLottery['date'];
    lotteryWin: IPerformanceLottery['lotteryWin'];
    timeUpdate: IPerformanceLottery['timeUpdate'];

    constructor(data: IPerformanceLottery) {
        this.id = data.id;
        this.infoId = data.infoId;
        this.organizationId = data.organizationId;
        this.spaceId = data.spaceId;
        this.priority = data.priority;
        this.date = data.date;
        this.lotteryWin = data.lotteryWin;
        this.timeUpdate = data.timeUpdate;
    }

    static fromDB(lottery: typeof PerformanceLottery.$inferSelect): IPerformanceLottery {
        return {
            id: lottery.id,
            infoId: lottery.infoId,
            organizationId: lottery.organizationId,
            spaceId: lottery.spaceId,
            priority: lottery.priority,
            date: lottery.date,
            lotteryWin: lottery.lotteryWin,
            timeUpdate: lottery.timeUpdate,
        };
    }
}