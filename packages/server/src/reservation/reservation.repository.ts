import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { eq, sql, and, lt, gt, lte, gte, or, ne } from 'drizzle-orm';
import {
  ReservationInputType,
  ReservationOutputType,
  ReservationType,
} from '@depot/types/reservation';
import e from 'express';

@Injectable()
export class ReservationRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getReservationAll(): Promise<ReservationType[] | false> {
    const result = (await this.db
      .select()
      .from(schema.reservations)) as ReservationType[];
    Logger.log('Reservations: ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }

  async getReservationBySpaceID(
    space_id: number,
  ): Promise<ReservationType[] | false> {
    const result = (await this.db
      .select()
      .from(schema.reservations)
      .where(eq(schema.reservations.space_id, space_id))) as ReservationType[];
    Logger.log('Space ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }

  async addReservation(
    time_from,
    time_to,
    space_id,
    user_id,
  ): Promise<Boolean> {
    const newReservation = {
      space_id: space_id,
      user_id: user_id,
      time_from: time_from,
      time_to: time_to,
    } as ReservationType;
    try {
      await this.db.insert(schema.reservations).values(newReservation);
      return true;
    } catch (e) {
      return false;
    }
  }

  formatDateToSQL(date: Date): string {
    // Date 객체를 SQL DATETIME 형식으로 변환
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  async checkTimeOverlap(spaceId: number, newTimeFrom: Date, newTimeTo: Date) {
    const formattedTimeFrom = this.formatDateToSQL(newTimeFrom);
    const formattedTimeTo = this.formatDateToSQL(newTimeTo);

    const overlappingReservations = await this.db
      .select()
      .from(schema.reservations)
      .where(
        and(
          eq(schema.reservations.space_id, spaceId), // 같은 space_id인지 확인
          eq(schema.reservations.state, 'grant'), // 승인된 예약만
          or(
            and(
              gt(sql`${formattedTimeFrom}`, schema.reservations.time_from), // 새로운 time_from이 기존 time_from 이후이고
              lt(sql`${formattedTimeFrom}`, schema.reservations.time_to), // 새로운 time_from이 기존 time_to 이전인 경우
            ), // 조건 1: 새로운 time_from이 기존 구간 안에 있는지, 경계 제외
            and(
              gt(sql`${formattedTimeTo}`, schema.reservations.time_from), // 새로운 time_to가 기존 time_from 이후이고
              lt(sql`${formattedTimeTo}`, schema.reservations.time_to), // 새로운 time_to가 기존 time_to 이전인 경우
            ), // 조건 2: 새로운 time_to가 기존 구간 안에 있는지, 경계 제외
            and(
              lte(sql`${formattedTimeFrom}`, schema.reservations.time_from), // 새로운 time_from이 기존 time_from과 같거나 더 이전인 경우
              gte(sql`${formattedTimeTo}`, schema.reservations.time_to), // 새로운 time_to가 기존 time_to와 같거나 더 이후인 경우
            ), // 조건 3: 새로운 구간이 기존 구간과 완전히 같거나, 기존 구간을 포함하는지
          ),
        ),
      );

    return overlappingReservations.length == 0; // 겹치는 예약이 있으면 false
  }

  // 일간 예약 시간을 계산하는 함수
  async getDailyReservationTime(
    userId: string,
    spaceId: number,
    timeFrom: Date,
  ): Promise<number> {
    const t = new Date(timeFrom);
    t.setHours(0, 0, 0, 0);
    const result = await this.db
      .select({
        total_reserved_time: sql`COALESCE(SUM(TIMESTAMPDIFF(MINUTE, ${schema.reservations.time_from}, ${schema.reservations.time_to})), 0)`,
      })
      .from(schema.reservations)
      .where(
        and(
          eq(schema.reservations.user_id, userId),
          eq(schema.reservations.space_id, spaceId),
          eq(schema.reservations.state, 'grant'), // 승인된 예약만
          sql`DATE(${schema.reservations.time_from}) = DATE(${t})`, // 같은 날짜의 예약
        ),
      );
    Logger.log('DateTime: ' + t);
    Logger.log('Daily reservation time: ' + JSON.stringify(result));
    // 예약된 시간이 없을 경우 0을 반환
    return Number(result[0]?.total_reserved_time) ?? 0;
  }

  // 주간 예약 시간을 계산하는 함수
  async getWeeklyReservationTime(
    userId: string,
    spaceId: number,
    timeFrom: Date,
  ): Promise<number> {
    const result = await this.db
      .select({
        total_reserved_time: sql`COALESCE(SUM(TIMESTAMPDIFF(MINUTE, ${schema.reservations.time_from}, ${schema.reservations.time_to})), 0)`,
      })
      .from(schema.reservations)
      .where(
        and(
          eq(schema.reservations.user_id, userId),
          eq(schema.reservations.space_id, spaceId),
          eq(schema.reservations.state, 'grant'), // 승인된 예약만
          sql`WEEK(${schema.reservations.time_from}) = WEEK(${timeFrom})`, // 같은 주의 예약
          sql`YEAR(${schema.reservations.time_from}) = YEAR(${timeFrom})`, // 같은 연도 내의 예약
        ),
      );
    Logger.log('Weekly reservation time: ' + JSON.stringify(result));
    // 예약된 시간이 없을 경우 0을 반환
    return Number(result[0]?.total_reserved_time) ?? 0;
  }

  async createReservation(
    reservationInput: ReservationInputType,
  ): Promise<boolean> {
    try {
      // 데이터 삽입
      await this.db.insert(schema.reservations).values({
        user_id: reservationInput.user_id,
        team_id: reservationInput.team_id,
        space_id: reservationInput.space_id,
        time_from: new Date(reservationInput.time_from),
        time_to: new Date(reservationInput.time_to),
        time_post: new Date(),
        content: reservationInput.content,
        comment: null,
        state: reservationInput.state,
        worker_need: reservationInput.worker_need,
      });

      // 삽입된 데이터가 있는지 user_id, space_id, time_from으로 확인
      const insertedReservation = await this.db
        .select()
        .from(schema.reservations)
        .where(
          and(
            eq(schema.reservations.user_id, reservationInput.user_id),
            eq(schema.reservations.space_id, reservationInput.space_id),
            eq(
              schema.reservations.time_from,
              new Date(reservationInput.time_from),
            ),
          ),
        );

      if (insertedReservation.length > 0) {
        Logger.log(
          'Reservation inserted successfully:',
          insertedReservation[0],
        );
        return true;
      } else {
        console.error('Reservation insertion failed');
        return false;
      }
    } catch (e) {
      console.error('Error inserting reservation:', e);
      return false;
    }
  }

  async updateReservation(reservation: ReservationType): Promise<boolean> {
    try {
      await this.db
        .update(schema.reservations)
        .set({
          state: reservation.state,
          worker_need: reservation.worker_need,
          comment: reservation.comment,
        })
        .where(
          eq(schema.reservations.reservation_id, reservation.reservation_id),
        );
      return true;
    } catch (e) {
      console.error('Error updating reservation:', e);
      return false;
    }
  }

  async getManageReservation(): Promise<ReservationOutputType[] | false> {
    const result = (await this.db
      .select({
        reservation_id: schema.reservations.reservation_id,
        user_id: schema.reservations.user_id,
        team_id: schema.reservations.team_id,
        space_id: schema.reservations.space_id,
        time_from: schema.reservations.time_from,
        time_to: schema.reservations.time_to,
        time_post: schema.reservations.time_post,
        content: schema.reservations.content,
        comment: schema.reservations.comment,
        state: schema.reservations.state,
        worker_need: schema.reservations.worker_need,
        name: schema.spaces.name,
        space_type: schema.spaces.space_type,
        userInfo: schema.users,
      })
      .from(schema.reservations)
      .innerJoin(
        schema.spaces,
        eq(schema.reservations.space_id, schema.spaces.space_id),
      )
      .innerJoin(
        schema.users,
        eq(schema.reservations.user_id, schema.users.user_id),
      )
      .where(
        or(
          or(
            eq(schema.reservations.state, 'wait'),
            eq(schema.reservations.state, 'received'),
          ),
          and(
            eq(schema.reservations.state, 'grant'),
            or(
              eq(schema.reservations.worker_need, 'required'),
              eq(schema.reservations.worker_need, 'failed'),
            ),
          ),
        ),
      )) as ReservationOutputType[];
    Logger.log('Manage Reservations: ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }

  async getReservationListByUserId(
    user_id: string,
  ): Promise<ReservationOutputType[] | false> {
    const result = (await this.db
      .select({
        reservation_id: schema.reservations.reservation_id,
        user_id: schema.reservations.user_id,
        team_id: schema.reservations.team_id,
        space_id: schema.reservations.space_id,
        time_from: schema.reservations.time_from,
        time_to: schema.reservations.time_to,
        time_post: schema.reservations.time_post,
        content: schema.reservations.content,
        comment: schema.reservations.comment,
        state: schema.reservations.state,
        worker_need: schema.reservations.worker_need,
        name: schema.spaces.name,
        space_type: schema.spaces.space_type,
        userInfo: schema.users,
      })
      .from(schema.reservations)
      .innerJoin(
        schema.spaces,
        eq(schema.reservations.space_id, schema.spaces.space_id),
      )
      .innerJoin(
        schema.users,
        eq(schema.reservations.user_id, schema.users.user_id),
      )
      .where(
        eq(schema.reservations.user_id, user_id),
      )) as ReservationOutputType[];
    Logger.log('User Reservations: ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }
}
