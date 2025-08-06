import { ISeminarLottery } from '@scspace-depot/types/lottery';
import { SeminarLottery } from '@schema';

export class MSeminarLottery implements ISeminarLottery {
    id: ISeminarLottery['id'];
    seminarInfoId: ISeminarLottery['seminarInfoId'];
    organizationId: ISeminarLottery['organizationId'];
    spaceId: ISeminarLottery['spaceId'];
    time: ISeminarLottery['time'];
    lotteryWin: ISeminarLottery['lotteryWin'];
    timeUpdate: ISeminarLottery['timeUpdate'];

    constructor(data: ISeminarLottery) {
        this.id = data.id;
        this.seminarInfoId = data.seminarInfoId;
        this.organizationId = data.organizationId;
        this.spaceId = data.spaceId;
        this.time = data.time;
        this.lotteryWin = data.lotteryWin;
        this.timeUpdate = data.timeUpdate;
    }

    static fromDB(lottery: typeof SeminarLottery.$inferSelect): ISeminarLottery {
        return {
            id: lottery.id,
            seminarInfoId: lottery.seminarInfoId,
            organizationId: lottery.organizationId,
            spaceId: lottery.spaceId,
            time: lottery.time,
            lotteryWin: lottery.lotteryWin,
            timeUpdate: lottery.timeUpdate,
        };
    }
}
