import {
  mysqlTable,
  int,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

import { User } from './user';

// Organization Table
export const Organization = mysqlTable('organization', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 128 }).notNull(),
  delegatorId: int('delegator_id')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  timeRegister: timestamp('time_register', { mode: 'string' }).notNull().defaultNow(),
  timeUpdate: timestamp('time_update', { mode: 'string' }).notNull().defaultNow().onUpdateNow(),
  // Foreign keys
  // delegatorId references users.userId O
});

// Organization Members Table
export const OrganizationMember = mysqlTable('organization_member', {
  id: int('id').primaryKey().autoincrement(),
  organizationId: int('organization_id')
    .notNull()
    .references(() => Organization.id, { onDelete: 'cascade' }),
  userId: int('user_id')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  timeRegister: timestamp('time_register', { mode: 'string' }).notNull().defaultNow(),
  // Foreign keys
  // organizationId references organizations.organizationId O
  // userId references users.userId O
});
