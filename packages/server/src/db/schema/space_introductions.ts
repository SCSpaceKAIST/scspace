import { mysqlTable, serial, json, int } from 'drizzle-orm/mysql-core';

// Space Introductions Table
export const space_introductions = mysqlTable('space_introductions', {
  id: serial('id').primaryKey(),
  space_type: int('space_type').notNull(), // ['individual', 'piano', 'seminar', 'dance', 'group', 'mirae', 'sumi', 'open', 'work']
  intro_type: int('intro_type').notNull(), // ['introduction', 'usage', 'caution', 'shortintro']
  info: json('info').notNull(),
});
