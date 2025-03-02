import {
  ReservationStateEnum,
  ReservationWorkerNeedEnum,
} from '@depot/enums/reservation.enum';
import {
  mysqlTable,
  varchar,
  int,
  serial,
  timestamp,
  boolean,
} from 'drizzle-orm/mysql-core';

// Reservations Table
export const Reservation = mysqlTable('reservation', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(), // .references(() => users.userId),
  teamId: int('team_id'), //.references(() => users.userId),
  spaceId: int('space_id').notNull(), //.references(() => spaces.space_id),
  timeFrom: timestamp('time_from').notNull(),
  timeTo: timestamp('time_to').notNull(),
  timePost: timestamp('time_post').notNull().defaultNow(),
  timeEdit: timestamp('time_edit').onUpdateNow(),
  comment: varchar('comment', { length: 300 }),
  state: int('state').notNull().default(ReservationStateEnum.WAIT), // ['grant', 'wait', 'received', 'rejected']
  workerNeed: int('worker_need')
    .notNull()
    .default(ReservationWorkerNeedEnum.UNNECESSARY), // ['unnecessary', 'required', 'completed', 'failed']
});

export const ReservationContent = mysqlTable('reservation_content', {
  id: serial('id').primaryKey(),
  reservationId: int('reservation_id').notNull(),
  spaceType: int('space_type').notNull(),

  eventName: varchar('event_name', { length: 255 }).notNull(),
  // Optional organizationName (exists in several types)
  organizationName: varchar('organization_name', { length: 255 }),

  // General contents
  contents: varchar('contents', { length: 255 }),

  // Participant numbers
  participantNumber: int('participant_number'),
  innerParticipantNumber: int('inner_participant_number'),
  outerParticipantNumber: int('outer_participant_number'),

  // Event purpose (for Open & Mirae & Sumi)
  eventPurpose: varchar('event_purpose', { length: 255 }),

  // Food options (for Mirae & Sumi)
  food: varchar('food', { length: 255 }),

  // Sumi-specific fields
  desk: int('desk'),
  chair: int('chair'),
  lobby: boolean('lobby'),

  // Work Complete (for Open)
  workComplete: boolean('work_complete'),
});

export const ReservationContentArrayElement = mysqlTable(
  'reservation_content_array_element',
  {
    id: serial('id').primaryKey(),
    reservationId: int('reservation_id').notNull(),
    element: int('element').notNull(),
    elementType: int('element_type').notNull(), // ReservationContentArrayElementTypeEnum
  },
);
