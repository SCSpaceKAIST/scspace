// Table: notices
export interface NoticeType {
  id: number;
  time_post: Date;
  time_edit?: Date | null;
  title: string; // varchar(255)
  content: string; // text
  views: number;
  important: number; // tinyint(1)
  user_id: string; // char(8)
}

export type NoticeInputType = Omit<
  NoticeType,
  "id" | "time_post" | "time_edit" | "views"
>;
