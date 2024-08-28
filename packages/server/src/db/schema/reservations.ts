import {
  mysqlTable,
  varchar,
  char,
  datetime,
  int,
  json,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { users } from './users';
import { spaces } from './spaces';

// Reservations Table
export const reservations = mysqlTable('reservations', {
  reservation_id: int('reservation_id').primaryKey(),
  user_id: char('user_id', { length: 8 }).notNull(), // .references(() => users.user_id),
  team_id: int('team_id'), //.references(() => users.user_id),
  space_id: int('space_id').notNull(), //.references(() => spaces.space_id),
  time_from: datetime('time_from').notNull(),
  time_to: datetime('time_to').notNull(),
  time_post: datetime('time_post').notNull(),
  time_edit: datetime('time_edit').notNull(),
  content: json('content').notNull(),
  comment: varchar('comment', { length: 300 }).notNull(),
  state: mysqlEnum('state', ['grant', 'wait', 'rejected']).notNull(),
  worker_need: mysqlEnum('worker_need', [
    'unnecessary',
    'required',
    'completed',
    'failed',
  ])
    .notNull()
    .default('unnecessary'),
  // Foreign keys
  // space_id references spaces.space_id O
  // user_id references users.user_id O
  // team_id references teams.team_id O
});
