import {
  mysqlTable,
  varchar,
  int,
  serial,
  timestamp,
  boolean,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { User } from './user';
import { Organization } from './organization';
import { Space } from './space';

// Reservations Table
export const Reservation = mysqlTable('reservation', {
  id: serial('id').primaryKey(),
  userId: int('user_id')
    .notNull()
    .references(() => User.id),
  organizationId: int('organization_id')
    .notNull()
    .references(() => Organization.id),
  spaceId: int('space_id')
    .notNull()
    .references(() => Space.id),
  title: varchar('title', { length: 255 }).notNull(),
  timeFrom: timestamp('time_from').notNull(),
  timeTo: timestamp('time_to').notNull(),
  timePost: timestamp('time_post').notNull().defaultNow(),
  timeEdit: timestamp('time_edit').onUpdateNow(),
  state: int('state').notNull().default(1), // ['grant', 'wait', 'received', 'rejected']
});

export const ReservationContent = mysqlTable('reservation_content', {
  id: serial('id')
    .primaryKey()
    .references(() => Reservation.id, { onDelete: 'cascade' }),
  description: varchar('description', { length: 1024 }),

  innerParticipantNumber: int('inner_participant_number'),
  outerParticipantNumber: int('outer_participant_number'),

  // Food options (for Mirae & Sumi)
  food: varchar('food', { length: 255 }),

  // Sumi-specific fields
  desk: int('desk'),
  chair: int('chair'),
  lobby: boolean('lobby'),

  workerNeed: int('worker_need').notNull().default(1), // ['unnecessary', 'required', 'completed', 'failed']
});

export const ReservationRelations = relations(Reservation, ({ one }) => ({
  content: one(ReservationContent, {
    fields: [Reservation.id],
    references: [ReservationContent.id],
  }),
}));
