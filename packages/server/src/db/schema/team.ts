import {
  mysqlTable,
  serial,
  int,
  boolean,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

// Teams Table
export const Team = mysqlTable('team', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 70 }).notNull(),
  delegatorId: int('delegator_id').notNull(),
  timeRegister: timestamp('time_register').notNull().defaultNow(),
  semesterId: int('semester_id').notNull(),
  // Foreign keys
  // delegatorId references users.userId O
  // semesterId references semesters.semesterId O
});

// Team Members Table
export const TeamMember = mysqlTable('team_member', {
  id: serial('id').primaryKey(),
  teamId: int('team_id').notNull(), //.references(() => teams.teamId),
  userId: int('user_id').notNull(), //.references(() => users.userId),
  joined: boolean('joined').notNull().default(false),
  // Foreign keys
  // teamId references teams.teamId O
  // userId references users.userId O
});
