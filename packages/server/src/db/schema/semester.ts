import { mysqlTable, int, serial, timestamp } from 'drizzle-orm/mysql-core';

export const Semester = mysqlTable('semester', {
  id: serial('id').primaryKey(),
  dateFrom: timestamp('date_from').notNull(),
  dateTo: timestamp('date_to').notNull(),
  year: int('year').notNull(),
  season: int('season').notNull(), // SemesterSeasonEnum
});
