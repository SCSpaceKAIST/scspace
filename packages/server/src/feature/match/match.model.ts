export interface IMatchPredictionCreate {
  user_id: number;
  match_id: number;
  first_score_a: number;
  first_score_b: number;
  second_score_a: number;
  second_score_b: number;
}