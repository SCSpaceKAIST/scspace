import { mysqlTable, char, serial, datetime } from 'drizzle-orm/mysql-core';
import { users } from './users';
import { semesters } from './semesters';

// Teams Table
export const teams = mysqlTable('teams', {
  team_id: serial('team_id').primaryKey(),
  name: char('name', { length: 70 }).notNull(),
  delegator_id: char('delegator_id', { length: 8 }).notNull(),
  //.references(() => users.user_id),
  time_register: datetime('time_register').notNull(),
  semester_id: char('semester_id', { length: 3 }).notNull(),
  //.references(() => semesters.semester_id),
  // Foreign keys
  // delegator_id references users.user_id O
  // semester_id references semesters.semester_id O
});
