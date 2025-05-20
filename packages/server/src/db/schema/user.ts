import { mysqlTable, varchar, serial, int } from 'drizzle-orm/mysql-core';

// users 테이블 정의
export const User = mysqlTable('user', {
  id: int('id').primaryKey().autoincrement().unique(),
  studentNumber: int('student_number').notNull().unique(), // 학번(student_number) or 사번(employee_number)
  nameKr: varchar('name_kr', { length: 128 }).notNull(),
  nameEn: varchar('name_en', { length: 128 }).notNull(),
  email: varchar('email', { length: 128 }).notNull().unique(),
  type: int('type').notNull().default(1), // type은 enum 필드 user, manager, admin, chief
});
