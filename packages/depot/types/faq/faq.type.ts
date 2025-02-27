// Table: faqs
export interface IFaq {
  id: number;
  question: string; // varchar(255)
  answer: string; // text
  time_post: Date;
  time_edit?: Date | null;
}
