import {
  mysqlTable,
  serial,
  varchar,
  char,
  datetime,
  int,
  text,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { users } from './users';

// Asks Table
export const asks = mysqlTable('asks', {
  id: serial('id').primaryKey(),
  user_id: int('user_id'), //.references(() => users.user_id),
  time_post: datetime('time_post').notNull(),
  time_edit: datetime('time_edit'),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  views: int('views').default(0).notNull(),
  state: mysqlEnum('state', ['wait', 'receive', 'solve']).notNull(),
  comment: text('comment'),
  commenter_id: int('commenter_id'),
  //.references(() => users.user_id),
  // Foreign key
  // user_id references users.user_id O
  // commenter_id references users.user_id O
});
