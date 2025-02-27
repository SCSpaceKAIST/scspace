import {
  mysqlTable,
  serial,
  varchar,
  datetime,
  int,
  text,
} from 'drizzle-orm/mysql-core';

// Asks Table
export const asks = mysqlTable('asks', {
  id: serial('id').primaryKey(),
  user_id: int('user_id'), //.references(() => users.user_id),
  time_post: datetime('time_post').notNull(),
  time_edit: datetime('time_edit'),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  views: int('views').default(0).notNull(),
  state: int('state').notNull(), //['wait', 'receive', 'solve']
  comment: text('comment'),
  commenter_id: int('commenter_id'),
});
