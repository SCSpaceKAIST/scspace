import {
  mysqlTable,
  serial,
  int,
  timestamp,
  varchar,
  boolean,
} from 'drizzle-orm/mysql-core';

// Passwords Table
export const Password = mysqlTable('password', {
  id: serial('id').primaryKey(),
  password: varchar('password', { length: 10 }).notNull(),
  spaceId: int('space_id').notNull(), //.references(() => spaces.space_id),
  timePost: timestamp('time_post').notNull().defaultNow(),
  timeEdit: timestamp('time_edit').onUpdateNow(),
  changed: boolean('changed').default(false).notNull(),
  userId: int('user_id').notNull(),
  // Foreign key
  // space_id references spaces.space_id O
});
