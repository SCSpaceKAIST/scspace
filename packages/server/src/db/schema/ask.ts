import {
  mysqlTable,
  serial,
  varchar,
  int,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

// Asks Table
export const Ask = mysqlTable('ask', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(), //.references(() => users.userId),
  timePost: timestamp('time_post').notNull().defaultNow(),
  timeEdit: timestamp('time_edit').onUpdateNow(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  views: int('views').default(0).notNull(),
  state: int('state').notNull().default(1), //['wait', 'receive', 'solve']
  comment: text('comment'),
  commenterId: int('commenter_id'),
});
