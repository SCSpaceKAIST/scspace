import {
  mysqlTable,
  varchar,
  char,
  datetime,
  int,
  json,
  serial,
} from 'drizzle-orm/mysql-core';

// Reservations Table
export const reservations = mysqlTable('reservations', {
  reservation_id: serial('reservation_id').primaryKey(),
  user_id: char('user_id', { length: 8 }).notNull(), // .references(() => users.user_id),
  team_id: int('team_id'), //.references(() => users.user_id),
  space_id: int('space_id').notNull(), //.references(() => spaces.space_id),
  time_from: datetime('time_from').notNull(),
  time_to: datetime('time_to').notNull(),
  time_post: datetime('time_post').notNull(),
  content: json('content'),
  comment: varchar('comment', { length: 300 }),
  state: int('state').notNull().default(1), // ['grant', 'wait', 'received', 'rejected']
  worker_need: int('worker_need').notNull().default(1), // ['unnecessary', 'required', 'completed', 'failed']
});
