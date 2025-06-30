import {
    mysqlTable,
    varchar,
    int,
    bigint,
} from 'drizzle-orm/mysql-core';
import { User } from './user';

// file 테이블 정의
export const File = mysqlTable('file', {
    id: int('id').primaryKey().autoincrement().unique(),
    userId: int('user_id')
        .notNull()
        .references(() => User.id, { onDelete: 'cascade' }),
    class: int('class').notNull().default(1), // ['notice', 'business', 'goods', 'rule', 'qna']
    type: int('type').notNull().default(1), // ['other', 'image', 'pdf']
    keyId: int('keyId').notNull().default(0),
    title: varchar('title', { length: 255 }).notNull(),
    path: varchar('path', { length: 255 }).notNull(),
    timePost: bigint('time_post', { mode: 'number' }).notNull(),
    state: int('state').notNull().default(1), // ['using', 'delete']
    // Foreign keys
    // keyId references class.Id O
});