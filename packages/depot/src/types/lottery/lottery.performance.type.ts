export interface IPerformanceLottery {
    id: number;
    infoId: number;
    organizationId: number;
    spaceId: number;
    priority: number;
    date: number;
    lotteryWin: number; // 0: not winner, 1: winner
}

export type IPerformanceLotteryCreate = Omit<
    IPerformanceLottery,
    "id" | "lotteryWin"
>;

export type IPerformanceLotteryUpdate = {
    lotteryWin: number;
}

export type IPerformanceLotteryUpdateAdmin = Partial<IPerformanceLotteryCreate & IPerformanceLotteryUpdate>;

export type IPerformanceLotteryFetch = Partial<Omit<IPerformanceLottery, "reservationId">>;
