import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { User } from './user';
import { Organization } from './organization';
import { Space } from './space';

// Reservations Table
export const Reservation = mysqlTable('reservation', {
  id: int('id').primaryKey().autoincrement().unique(),
  userId: int('user_id')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  organizationId: int('organization_id')
    .notNull()
    .references(() => Organization.id, { onDelete: 'cascade' }),
  spaceId: int('space_id')
    .notNull()
    .references(() => Space.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  timeFrom: int('time_from').notNull(),
  timeTo: int('time_to').notNull(),
  timePost: int('time_post').notNull(),
  timeUpdate: int('time_update').notNull(),
  state: int('state').notNull().default(1), // ['grant', 'wait', 'received', 'rejected']
});

export const ReservationContent = mysqlTable('reservation_content', {
  id: int('id')
    .primaryKey()
    .references(() => Reservation.id, { onDelete: 'cascade' }),
  description: varchar('description', { length: 1024 }).notNull().default(''),
  innerParticipantNumber: int('inner_participant_number').notNull().default(0),
  outerParticipantNumber: int('outer_participant_number').notNull().default(0),
  food: varchar('food', { length: 255 }).notNull().default(''), // For Mirae & Sumi
  desk: int('desk').notNull().default(0), // For Sumi
  chair: int('chair').notNull().default(0), // For Sumi
  lobby: boolean('lobby').notNull().default(false), // For Sumi
  busking: boolean('busking').notNull().default(false), // For Mirae & Sumi
  workerNeed: int('worker_need').notNull().default(1), // ['unnecessary', 'required', 'completed', 'failed']
});

export const ReservationRelations = relations(Reservation, ({ one }) => ({
  content: one(ReservationContent, {
    fields: [Reservation.id],
    references: [ReservationContent.id],
  }),
}));
