export interface ISeminarLottery {
    id: number;
    infoId: number;
    organizationId: number;
    spaceId: number;
    time: number;
    lotteryWin: number; // 0: not winner, 1: winner
    timeUpdate: number;
}

export type ISeminarLotteryCreate = Omit<
    ISeminarLottery,
    "id" | "timeUpdate" | "lotteryWin"
>;

export type ISeminarLotteryFetch = Partial<Omit<ISeminarLottery, "timeUpdate">>;