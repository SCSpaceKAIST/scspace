import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider'; 
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, MatchPrediction, MatchInfo } from '@schema'; 
import { eq, desc, InferInsertModel } from 'drizzle-orm';
import { IMatchPredictionCreate } from './match.model'; // DTO 대신 모델 임포트

@Injectable()
export class MatchPredictionRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async insert(data: IMatchPredictionCreate) { // 타입 변경
    const insertData = {
      userId: data.user_id,
      matchId: data.match_id,
      firstScoreA: data.first_score_a,
      firstScoreB: data.first_score_b,
      secondScoreA: data.second_score_a,
      secondScoreB: data.second_score_b,
    } as InferInsertModel<typeof MatchPrediction>;

    const [result] = await this.db.insert(MatchPrediction).values(insertData);
    
    if (!result.insertId) {
      throw new Error('데이터 저장에 실패했습니다.');
    }

    return result.insertId;
  }
  
  async fetchByUserId(userId: number) {
    const result = await this.db
      .select({
        prediction: MatchPrediction,
        matchInfo: MatchInfo,
      })
      .from(MatchPrediction)
      // match_info 테이블과 조인하여 경기 상세 정보(이름, 팀 등)를 함께 가져옵니다.
      .leftJoin(MatchInfo, eq(MatchPrediction.matchId, MatchInfo.id))
      .where(eq(MatchPrediction.userId, userId))
      .orderBy(desc(MatchPrediction.timeSubmit)); // 최신 제출 순 정렬

    if (result.length === 0) {
      throw new NotFoundException(`유저 ID ${userId}의 예측 데이터가 없습니다.`);
    }

    return result;
  }

}