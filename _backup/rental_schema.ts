import {
    mysqlTable,
    varchar,
    int,
    bigint,
} from 'drizzle-orm/mysql-core';
import { User } from './user';

// goods 테이블 정의
export const Goods = mysqlTable('goods', {
    id: int('id').primaryKey().autoincrement().unique(),
    name: varchar('name', { length: 128 }).notNull(),
    description: varchar('description', { length: 4098 }),
    countAll: int('count_all').notNull().default(1),
    countNow: int('count_now').notNull(), // 기본값 제거, repository에서 설정
    imageURI: varchar('image_uri', { length: 256 }), // 64 -> 256으로 확장
});

// rental 테이블 정의
export const Rental = mysqlTable('rental', {
    id: int('id').primaryKey().autoincrement().unique(),
    userId: int('user_id')
        .notNull()
        .references(() => User.id, { onDelete: 'cascade' }),
    goodsId: int('goods_id')
        .notNull()
        .references(() => Goods.id, { onDelete: 'cascade' }),
    count: int('count').notNull().default(1),
    timeBorrow: bigint('time_borrow', { mode: 'number' }).notNull(),
    timeDue: bigint('time_due', { mode: 'number' }).notNull(),
    timeReturn: bigint('time_return', { mode: 'number' }).notNull().default(0),
    timeConfirm: bigint('time_confirm', { mode: 'number' }).notNull().default(0),
    certName: varchar('cert_name', { length: 256 }).notNull(),
    // Foreign keys
    // userId references users.userId O
    // goodsId references goods.goodsId O
});