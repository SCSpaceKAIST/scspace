import {
  mysqlTable,
  serial,
  varchar,
  int,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/mysql-core';

// Notices Table
export const Notice = mysqlTable('notice', {
  id: serial('id').primaryKey(),
  timePost: timestamp('time_post').notNull().defaultNow(),
  timeEdit: timestamp('time_edit').onUpdateNow(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  views: int('views').default(0).notNull(),
  important: boolean('important').default(false).notNull(),
  userId: int('user_id').notNull(), //.references(() => users.userId),
  // Foreign key
  // userId references users.userId O
});
