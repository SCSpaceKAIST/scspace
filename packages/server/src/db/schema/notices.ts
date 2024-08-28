import {
  mysqlTable,
  serial,
  varchar,
  char,
  datetime,
  int,
  text,
  tinyint,
} from 'drizzle-orm/mysql-core';
import { users } from './users';

// Notices Table
export const notices = mysqlTable('notices', {
  id: serial('id').primaryKey(),
  time_post: datetime('time_post').notNull(),
  time_edit: datetime('time_edit'),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  views: int('views').default(0).notNull(),
  important: tinyint('important').default(0).notNull(),
  user_id: char('user_id', { length: 8 }).notNull(), //.references(() => users.user_id),
  // Foreign key
  // user_id references users.user_id O
});
