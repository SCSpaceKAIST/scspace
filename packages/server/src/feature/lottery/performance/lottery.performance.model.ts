import { IPerformanceLottery } from '@scspace-depot/types/lottery';
import { PerformanceLottery } from '@schema';

export class MPerformanceLottery implements IPerformanceLottery {
    id: IPerformanceLottery['id'];
    infoId: IPerformanceLottery['infoId'];
    organizationId: IPerformanceLottery['organizationId'];
    spaceId: IPerformanceLottery['spaceId'];
    priority: IPerformanceLottery['priority'];
    date: IPerformanceLottery['date'];
    lotteryWin: IPerformanceLottery['lotteryWin'];

    constructor(data: IPerformanceLottery) {
        this.id = data.id;
        this.infoId = data.infoId;
        this.organizationId = data.organizationId;
        this.spaceId = data.spaceId;
        this.priority = data.priority;
        this.date = data.date;
        this.lotteryWin = data.lotteryWin;
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
        };
    }
}