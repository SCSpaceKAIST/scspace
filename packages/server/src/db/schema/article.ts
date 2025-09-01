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
    title: varchar('title', { length: 255 }).notNull(),
    content: varchar('content', { length: 8191 }),
    timePost: bigint('time_post', { mode: 'number' }).notNull(),
    timeUpdate: bigint('time_update', { mode: 'number' }).notNull(),
    state: int('state').notNull().default(1), // ['hide', 'show']
    type: int('type').notNull().default(0),
    images: varchar('images', { length: 3000 }),
    files: varchar('files', { length: 3000 }),
    // Foreign keys
    // userId references users.userId O
});


