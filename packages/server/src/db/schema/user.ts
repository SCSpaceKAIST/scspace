import { UserTypeEnum } from '@depot/enums/user.enum';
import { mysqlTable, varchar, serial, int } from 'drizzle-orm/mysql-core';

// users 테이블 정의
export const User = mysqlTable('user', {
  id: serial('id').primaryKey(), // id는 기본 키이면서 자동 증가
  kaistUID: varchar('kaist_uid', { length: 50 }).notNull().unique(), // userId는 8자리의 char, 고유 값
  userSSOId: varchar('user_sso_id', { length: 50 }), // userId는 8자리의 char, 고유 값
  nameKr: varchar('name_kr', { length: 128 }), // name은 128자리의 varchar
  nameEn: varchar('name_en', { length: 128 }), // email은 128자리의 varchar
  userNumber: varchar('user_number', { length: 128 }), // 학번(student_number) or 사번(employee_number)
  email: varchar('email', { length: 128 }), // email은 128자리의 varchar
  type: int('type').notNull().default(UserTypeEnum.USER), // type은 enum 필드 user, manager, admin, chief
});
