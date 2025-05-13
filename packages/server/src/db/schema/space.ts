import { int, mysqlTable, serial, varchar, json } from 'drizzle-orm/mysql-core';

export const Space = mysqlTable('space', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  nameEng: varchar('name_eng', { length: 100 }).notNull(),
  spaceType: int('space_type').notNull(), // SpaceTypeEnum
  // foreign key for space_type
});

// Space Introductions Table
export const SpaceIntroduction = mysqlTable('space_introduction', {
  id: serial('id').primaryKey(),
  spaceType: int('space_type').notNull(), // ['individual', 'piano', 'seminar', 'dance', 'group', 'mirae', 'sumi', 'open', 'work']
  introType: int('intro_type').notNull(), // ['introduction', 'usage', 'caution', 'shortintro']
  info: json('info').notNull(),
});
