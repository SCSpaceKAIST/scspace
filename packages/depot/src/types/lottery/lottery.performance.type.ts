export interface IPerformanceLottery {
    id: number;
    infoId: number;
    organizationId: number;
    spaceId: number;
    priority: number;
    date: number;
    lotteryWin: number; // 0: not winner, 1: winner
    reservationId: number; // bigint in the database, but treated as number in TypeScript
}
