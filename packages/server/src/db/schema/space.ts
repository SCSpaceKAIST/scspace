import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const Space = mysqlTable('space', {
  id: int('id').primaryKey().autoincrement().unique(),
  nameKr: varchar('name_kr', { length: 128 }).notNull(),
  nameEn: varchar('name_en', { length: 128 }).notNull(),
  spaceType: int('space_type').notNull(),
});
