import {
  mysqlTable,
  char,
  serial,
  datetime,
  int,
} from 'drizzle-orm/mysql-core';

// Teams Table
export const teams = mysqlTable('teams', {
  team_id: serial('team_id').primaryKey(),
  name: char('name', { length: 70 }).notNull(),
  delegator_id: int('delegator_id').notNull(),
  time_register: datetime('time_register').notNull(),
  semester_id: int('semester_id').notNull(),
  // Foreign keys
  // delegator_id references users.user_id O
  // semester_id references semesters.semester_id O
});
