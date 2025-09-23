import {
  mysqlTable,
  int,
  varchar,
  bigint,
} from 'drizzle-orm/mysql-core';

import { Space } from './space';

// Passpin Table
export const Passpin = mysqlTable('passpin', {
  id: int('id').primaryKey().autoincrement().unique(),
  spaceId: int('space_id').notNull().references(() => Space.id, { onDelete: 'cascade' }),
  pin: varchar('pin', { length: 127 }).notNull(),
  timeCreated: bigint('time_created', { mode: 'number' }).notNull(),
  status: int('status').notNull().default(1),
});