import {
  mysqlTable,
  serial,
  char,
  datetime,
  tinyint,
  int,
} from 'drizzle-orm/mysql-core';
import { spaces } from './spaces';

// Passwords Table
export const passwords = mysqlTable('passwords', {
  id: serial('id').primaryKey(),
  password: char('password', { length: 10 }).notNull(),
  space_id: int('space_id').notNull(), //.references(() => spaces.space_id),
  time_edit: datetime('time_edit').notNull(),
  changed: tinyint('changed').default(0).notNull(),
  // Foreign key
  // space_id references spaces.space_id O
});
