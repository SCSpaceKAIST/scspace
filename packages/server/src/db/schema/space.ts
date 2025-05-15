import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const Space = mysqlTable('space', {
  id: serial('id').primaryKey(),
  nameKr: varchar('name_kr', { length: 128 }).notNull(),
  nameEn: varchar('name_en', { length: 128 }).notNull(),
});
