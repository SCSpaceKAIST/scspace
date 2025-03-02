import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

// FAQs Table
export const Faq = mysqlTable('faq', {
  id: serial('id').primaryKey(),
  question: varchar('question', { length: 255 }).notNull(),
  answer: text('answer').notNull(),
  timePost: timestamp('time_post').notNull().defaultNow(),
  timeEdit: timestamp('time_edit').onUpdateNow(),
});
