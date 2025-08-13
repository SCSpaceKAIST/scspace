export interface ILotteryInfo {
    id: number;
    timeLotteryStart: number;
    timeLotteryEnd: number;
    timeStart: number;
    timeEnd: number;
    applied: boolean;
}

export type ILotteryInfoCreate = Omit<
    ILotteryInfo,
    "id" | "applied"
>;

export type ILotteryInfoUpdate = Partial<Omit<ILotteryInfo, "id">>;