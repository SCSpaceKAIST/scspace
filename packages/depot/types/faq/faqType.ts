// Table: faqs
export interface FaqType {
  id: number;
  question: string; // varchar(255)
  answer: string; // text
  time_post: Date;
  time_edit?: Date | null;
}
