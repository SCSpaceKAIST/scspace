export interface ISeminarLottery {
    id: number;
    infoId: number;
    organizationId: number;
    spaceId: number;
    time: number;
    lotteryWin: number; // 0: not winner, 1: winner
}

export type ISeminarLotteryCreate = Omit<
    ISeminarLottery,
    "id" | "lotteryWin"
>;

export type ISeminarLotteryUpdate = {
    lotteryWin: number;
}

export type ISeminarLotteryUpdateAdmin = Partial<ISeminarLotteryCreate & ISeminarLotteryUpdate>;

export type ISeminarLotteryFetch = Partial<Omit<ISeminarLottery, "reservationId">>;