import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const Space = mysqlTable('space', {
  id: int('id').primaryKey().autoincrement().unique(),
  nameKr: varchar('name_kr', { length: 127 }).notNull(),
  nameEn: varchar('name_en', { length: 127 }).notNull(),
  spaceType: int('space_type').notNull(),
});
