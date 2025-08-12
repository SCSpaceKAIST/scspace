export interface ISeminarLottery {
    id: number;
    infoId: number;
    organizationId: number;
    spaceId: number;
    time: number;
    lotteryWin: number; // 0: not winner, 1: winner
    reservationId: number; // bigint in the database, but treated as number in TypeScript
}

export type ISeminarLotteryCreate = Omit<
    ISeminarLottery,
    "id" | "reservationId" | "lotteryWin"
>;

export type ISeminarLotteryUpdate = {
    lotteryWin: number;
}

export type ISeminarLotteryFetch = Partial<Omit<ISeminarLottery, "timeUpdate">>;