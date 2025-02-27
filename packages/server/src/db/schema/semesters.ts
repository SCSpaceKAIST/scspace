import { mysqlTable, datetime, int, serial } from 'drizzle-orm/mysql-core';

export const semesters = mysqlTable('semesters', {
  id: serial('id').primaryKey(),
  date_from: datetime('date_from').notNull(),
  date_to: datetime('date_to').notNull(),
  year: int('year').notNull(),
  season: int('season').notNull(), // SemesterSeasonEnum
  type: int('type').notNull(), // SemesterTypeEnum
});
