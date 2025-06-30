import {
    mysqlTable,
    varchar,
    int,
    bigint,
} from 'drizzle-orm/mysql-core';

// rule 테이블 정의
export const Rule = mysqlTable('rule', {
    id: int('id').primaryKey().autoincrement().unique(),
    class: int('class').notNull().default(1), // ['space', 'rent']
    keyId: int('keyId').notNull().default(0),
    order: int('order').notNull().default(0),
    title: varchar('title', { length: 255 }).notNull(),
    content: varchar('path', { length: 4095 }).notNull(),
    timeUpdate: bigint('time_post', { mode: 'number' }).notNull(),
    state: int('state').notNull().default(1), // ['hide', 'show']
    // Foreign keys
    // keyId references class.Id O
});