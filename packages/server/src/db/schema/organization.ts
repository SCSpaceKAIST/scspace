import {
  mysqlTable,
  int,
  varchar,
  boolean,
  bigint,
} from 'drizzle-orm/mysql-core';

import { User } from './user';
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";

// Organization Table
export const Organization = mysqlTable('organization', {
  id: int('id')
    .primaryKey()
    .autoincrement()
    .unique(),
  name: varchar('name', { length: 128 })
    .notNull(),
  status: int('status')
    .notNull()
    .default(OrganizationStatusEnum.REGISTER_REQUEST),
  hasRoom: boolean('has_room')
    .notNull()
    .default(false),
  delegatorId: int('delegator_id')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  timeRegister: bigint('time_register', { mode: 'number' })
    .notNull(),
  timeUpdate: bigint('time_update', { mode: 'number' })
    .notNull(),
  // Foreign keys
  // delegatorId references users.userId O
});

// Organization Members Table
export const OrganizationMember = mysqlTable('organization_member', {
  id: int('id')
    .primaryKey()
    .autoincrement(),
  organizationId: int('organization_id')
    .notNull()
    .references(() => Organization.id, { onDelete: 'cascade' }),
  userId: int('user_id')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  timeRegister: bigint('time_register', { mode: 'number' })
    .notNull(),
  // Foreign keys
  // organizationId references organizations.organizationId O
  // userId references users.userId O
});
