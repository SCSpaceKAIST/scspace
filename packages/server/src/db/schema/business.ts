import {
    mysqlTable,
    varchar,
    int,
    bigint,
} from 'drizzle-orm/mysql-core';
import { User } from './user';

// business 테이블 정의
export const Business = mysqlTable('business', {
    id: int('id').primaryKey().autoincrement().unique(),
    userId: int('user_id')
        .notNull()
        .references(() => User.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    content: varchar('content', { length: 16383 }),
    timePost: bigint('time_post', { mode: 'number' }).notNull(),
    timeUpdate: bigint('time_update', { mode: 'number' }).notNull(),
    state: int('state').notNull().default(1), // ['hide', 'show']
    // Foreign keys
    // userId references users.userId O
});
