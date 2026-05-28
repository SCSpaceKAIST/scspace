export interface IMatchPredictionCreate {
  userId: number;
  matchId: number;
  firstScoreA: number;
  firstScoreB: number;
  secondScoreA: number;
  secondScoreB: number;
}

export interface IMatchPredictionUpdate {
  firstScoreA: number;
  firstScoreB: number;
  secondScoreA: number;
  secondScoreB: number;
}
