export interface ILotteryInfo {
    id: number;
    timeLotteryStart: number;
    timeLotteryEnd: number;
    timeStart: number;
    timeEnd: number;
}

export type ILotteryInfoCreate = Omit<
    ILotteryInfo,
    "id"
>;

export type ILotteryInfoUpdate = Partial<ILotteryInfoCreate>;