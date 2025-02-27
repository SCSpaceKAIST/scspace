import { mysqlTable, serial, int, boolean } from 'drizzle-orm/mysql-core';

// Team Members Table
export const team_members = mysqlTable('team_members', {
  id: serial('id').primaryKey(),
  team_id: int('team_id').notNull(), //.references(() => teams.team_id),
  user_id: int('user_id').notNull(), //.references(() => users.user_id),
  joined: boolean('joined').notNull(),
  // Foreign keys
  // team_id references teams.team_id O
  // user_id references users.user_id O
});
