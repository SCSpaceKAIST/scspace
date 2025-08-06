export interface ISeminarLottery {
    id: number;
    seminarInfoId: number;
    organizationId: number;
    spaceId: number;
    time: number;
    lotteryWin: number; // 0: not winner, 1: winner
    timeUpdate: number;
}

export type ISeminarLotteryCreate = Omit<
    ISeminarLottery,
    "id" | "timeUpdate"
>;

export type ISeminarLotteryUpdate = Partial<ISeminarLotteryCreate>;