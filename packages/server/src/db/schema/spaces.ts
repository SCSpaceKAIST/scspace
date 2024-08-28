import { mysqlTable, serial, varchar, mysqlEnum } from 'drizzle-orm/mysql-core';

export const spaces = mysqlTable('spaces', {
  space_id: serial('space_id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  name_eng: varchar('name_eng', { length: 100 }).notNull(),
  space_type: mysqlEnum('space_type', [
    'individual',
    'piano',
    'seminar',
    'dance',
    'group',
    'mirae',
    'sumi',
    'open',
    'work',
  ]).notNull(),
});
