import { mysqlTable, serial, json, mysqlEnum } from 'drizzle-orm/mysql-core';
import { spaces } from './spaces';

// Space Introductions Table
export const space_introductions = mysqlTable('space_introductions', {
  id: serial('id').primaryKey(),
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
  ]).notNull(), //.references(() => spaces.space_type),
  intro_type: mysqlEnum('intro_type', [
    'introduction',
    'usage',
    'caution',
    'shortintro',
  ]).notNull(),
  info: json('info').notNull(),
  // Foreign key
  // space_type references spaces.space_type O
});
