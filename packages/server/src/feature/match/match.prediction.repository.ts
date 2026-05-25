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
      userId: data.userId,
      matchId: data.matchId,
      firstScoreA: data.firstScoreA,
      firstScoreB: data.firstScoreB,
      secondScoreA: data.secondScoreA,
      secondScoreB: data.secondScoreB,
    } as InferInsertModel<typeof MatchPrediction>;

    const [result] = await this.db.insert(MatchPrediction).values(insertData);
    
    if (!result.insertId) {
      throw new Error('데이터 저장에 실패했습니다.');
    }

    return result.insertId;
  }
  
  async fetchByUserId(userId: number) {
    return this.db
      .select({
        prediction: MatchPrediction,
        matchInfo: MatchInfo,
      })
      .from(MatchPrediction)
      .leftJoin(MatchInfo, eq(MatchPrediction.matchId, MatchInfo.id))
      .where(eq(MatchPrediction.userId, userId))
      .orderBy(desc(MatchPrediction.timeSubmit));
  }

  async fetchAll() {
    return this.db.select().from(MatchInfo).orderBy(desc(MatchInfo.matchTime));
  }

  async fetchByMatchId(matchId: number) {
    const [result] = await this.db
      .select()
      .from(MatchInfo)
      .where(eq(MatchInfo.id, matchId));

    if (!result) {
      throw new NotFoundException(`경기 ID ${matchId}를 찾을 수 없습니다.`);
    }

    return result;
  }

}