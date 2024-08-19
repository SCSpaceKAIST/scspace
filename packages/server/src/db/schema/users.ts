import {
  mysqlTable,
  int,
  varchar,
  char,
  uniqueIndex,
  primaryKey,
  serial,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

// users 테이블 정의
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(), // id는 기본 키이면서 자동 증가
  userId: char('user_id', { length: 8 }).notNull().unique(), // user_id는 8자리의 char, 고유 값
  name: varchar('name', { length: 128 }).notNull(), // name은 128자리의 varchar
  email: varchar('email', { length: 128 }).notNull(), // email은 128자리의 varchar
  type: mysqlEnum('type', ['user', 'manager', 'admin', 'chief']).notNull(), // type은 enum 필드
});
