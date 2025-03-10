// Table: notices
export interface INotice {
  id: number;
  timePost: Date;
  timeEdit?: Date | null;
  title: string; // varchar(255)
  content: string; // text
  views: number;
  important: boolean; // tinyint(1)
  userId: number; // char(8)
}

export type INoticeCreate = Omit<
  INotice,
  "id" | "timePost" | "timeEdit" | "views"
>;
