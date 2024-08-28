import {
  mysqlTable,
  serial,
  varchar,
  datetime,
  text,
} from 'drizzle-orm/mysql-core';

// FAQs Table
export const faqs = mysqlTable('faqs', {
  id: serial('id').primaryKey(),
  question: varchar('question', { length: 255 }).notNull(),
  answer: text('answer').notNull(),
  time_post: datetime('time_post').notNull(),
  time_edit: datetime('time_edit'),
});
