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
  time_post: datetime('time_post').notNull().default(new Date()),
  time_edit: datetime('time_edit').notNull(),
  changed: tinyint('changed').default(0).notNull(),
  user_id: char('user_id', { length: 8 }),
  // Foreign key
  // space_id references spaces.space_id O
});
