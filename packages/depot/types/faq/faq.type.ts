// Table: faqs
export interface IFaq {
  id: number;
  question: string; // varchar(255)
  answer: string; // text
  timePost: Date;
  timeEdit?: Date | null;
}
