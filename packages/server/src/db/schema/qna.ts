import {
  mysqlTable,
  int,
  varchar,
  boolean,
  bigint,
} from 'drizzle-orm/mysql-core';

import { User } from './user';
import { sql } from 'drizzle-orm';

// Organization Table
export const Qna = mysqlTable('qna', {
  id: int('id').primaryKey().autoincrement().unique(),
  qUserId: int('q_user_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  aUserId: int('a_user_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  isSecret: boolean('is_secret').notNull().default(false),
  question: varchar('question', { length: 4095 }).notNull(),
  answer: varchar('answer', { length: 4095 }).notNull().default(''),
  completed: boolean('completed').notNull().default(false),
  timeRegister: bigint('time_register', { mode: 'number' }).notNull(),
  timeAnswer: bigint('time_answer', { mode: 'number' }).notNull().default(0),
  // Foreign keys
  // quid references users.userId O
  // auid references users.userId O
});