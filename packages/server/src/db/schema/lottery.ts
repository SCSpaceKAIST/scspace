import { mysqlTable, int, bigint } from 'drizzle-orm/mysql-core';
import { Organization } from './organization';
import { Space } from './space';

export const SeminarLotteryInfo = mysqlTable('s_lottery_info', {
  id: int('id').primaryKey().autoincrement().unique(),
  timeLotteryStart: bigint('time_lottery_start', { mode: 'number' }).notNull(),
  timeLotteryEnd: bigint('time_lottery_end', { mode: 'number' }).notNull(),
  timeStart: bigint('time_start', { mode: 'number' }).notNull(),
  timeEnd: bigint('time_end', { mode: 'number' }).notNull(),
});

export const SeminarLottery = mysqlTable('s_lottery', {
  id: int('id').primaryKey().autoincrement().unique(),
  infoId: int('info_id')
    .notNull()
    .references(() => SeminarLotteryInfo.id, { onDelete: 'cascade' }),
  organizationId: int('organization_id')
    .notNull()
    .references(() => Organization.id, { onDelete: 'cascade' }),
  spaceId: int('space_id')
    .notNull()
    .references(() => Space.id, { onDelete: 'cascade' }),
  time: int('time').notNull(),
  lotteryWin: int('lottery_win').notNull().default(0), // 0: not winner, 1: winner
  timeUpdate: bigint('time_update', { mode: 'number' }).notNull(),
});

export const PerformanceLotteryInfo = mysqlTable('p_lottery_info', {
  id: int('id').primaryKey().autoincrement().unique(),
  timeLotteryStart: bigint('time_lottery_start', { mode: 'number' }).notNull(),
  timeLotteryEnd: bigint('time_lottery_end', { mode: 'number' }).notNull(),
  timeStart: bigint('time_start', { mode: 'number' }).notNull(),
  timeEnd: bigint('time_end', { mode: 'number' }).notNull(),
});

export const PerformanceLottery = mysqlTable('p_lottery', {
  id: int('id').primaryKey().autoincrement().unique(),
  infoId: int('info_id')
    .notNull()
    .references(() => PerformanceLotteryInfo.id, { onDelete: 'cascade' }),
  organizationId: int('organization_id')
    .notNull()
    .references(() => Organization.id, { onDelete: 'cascade' }),
  spaceId: int('space_id')
    .notNull()
    .references(() => Space.id, { onDelete: 'cascade' }),
  priority: int('priority').notNull(),
  date: int('time').notNull(),
  lotteryWin: int('lottery_win').notNull().default(0), // 0: not winner, 1: winner
  timeUpdate: bigint('time_update', { mode: 'number' }).notNull(),
});
