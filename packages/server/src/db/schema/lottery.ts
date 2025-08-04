import { mysqlTable, int, bigint } from 'drizzle-orm/mysql-core';
import { Organization } from './organization';
import { Space } from './space';

export const SeminarInfo = mysqlTable('seminar_info', {
  id: int('id').primaryKey().autoincrement().unique(),
  organizationId: int('organization_id')
    .notNull()
    .references(() => Organization.id, { onDelete: 'cascade' }),
  timeLotteryStart: bigint('time_lottery_start', { mode: 'number' }).notNull(),
  timeLotteryEnd: bigint('time_lottery_end', { mode: 'number' }).notNull(),
  timeStart: bigint('time_start', { mode: 'number' }).notNull(),
  timeEnd: bigint('time_end', { mode: 'number' }).notNull(),
});

export const SeminarLottery = mysqlTable('seminar_lottery', {
  id: int('id').primaryKey().autoincrement().unique(),
  seminarInfoId: int('seminar_info_id')
    .notNull()
    .references(() => SeminarInfo.id, { onDelete: 'cascade' }),
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

export const PerformanceInfo = mysqlTable('performance_info', {
  id: int('id').primaryKey().autoincrement().unique(),
  organizationId: int('organization_id')
    .notNull()
    .references(() => Organization.id, { onDelete: 'cascade' }),
  timeLotteryStart: bigint('time_lottery_start', { mode: 'number' }).notNull(),
  timeLotteryEnd: bigint('time_lottery_end', { mode: 'number' }).notNull(),
  timeStart: bigint('time_start', { mode: 'number' }).notNull(),
  timeEnd: bigint('time_end', { mode: 'number' }).notNull(),
});

export const PerformanceLottery = mysqlTable('performance_lottery', {
  id: int('id').primaryKey().autoincrement().unique(),
  performanceInfoId: int('performance_info_id')
    .notNull()
    .references(() => PerformanceInfo.id, { onDelete: 'cascade' }),
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
