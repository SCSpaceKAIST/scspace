import {
  mysqlTable,
  char,
  datetime,
  int,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

export const semesters = mysqlTable('semesters', {
  semester_id: char('semester_id', { length: 3 }).primaryKey(),
  date_from: datetime('date_from').notNull(),
  date_to: datetime('date_to').notNull(),
  year: int('year').notNull(),
  season: mysqlEnum('season', ['봄', '가을']),
});
