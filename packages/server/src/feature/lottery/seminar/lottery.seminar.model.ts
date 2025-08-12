import { ISeminarLottery } from '@scspace-depot/types/lottery';
import { SeminarLottery } from '@schema';

export class MSeminarLottery implements ISeminarLottery {
    id: ISeminarLottery['id'];
    infoId: ISeminarLottery['infoId'];
    organizationId: ISeminarLottery['organizationId'];
    spaceId: ISeminarLottery['spaceId'];
    time: ISeminarLottery['time'];
    lotteryWin: ISeminarLottery['lotteryWin'];

    constructor(data: ISeminarLottery) {
        this.id = data.id;
        this.infoId = data.infoId;
        this.organizationId = data.organizationId;
        this.spaceId = data.spaceId;
        this.time = data.time;
        this.lotteryWin = data.lotteryWin;
    }

    static fromDB(lottery: typeof SeminarLottery.$inferSelect): ISeminarLottery {
        return {
            id: lottery.id,
            infoId: lottery.infoId,
            organizationId: lottery.organizationId,
            spaceId: lottery.spaceId,
            time: lottery.time,
            lotteryWin: lottery.lotteryWin,
        };
    }
}
