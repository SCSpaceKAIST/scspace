import {
    mysqlTable,
    varchar,
    int,
    bigint,
} from 'drizzle-orm/mysql-core';
import { User } from './user';

// article 테이블 정의
export const Article = mysqlTable('article', {
    id: int('id').primaryKey().autoincrement().unique(),
    userId: int('user_id')
        .notNull()
        .references(() => User.id, { onDelete: 'cascade' }),
    class: int('class').notNull().default(1), // ['notice', 'business']
    title: varchar('title', { length: 255 }).notNull(),
    content: varchar('content', { length: 32767 }),
    timePost: bigint('time_post', { mode: 'number' }).notNull(),
    timeUpdate: bigint('time_update', { mode: 'number' }).notNull(),
    state: int('state').notNull().default(1), // ['hide', 'show']
    // Foreign keys
    // userId references users.userId O
});
