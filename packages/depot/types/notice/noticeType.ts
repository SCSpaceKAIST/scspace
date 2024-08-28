// Table: notices
export interface NoticesType {
  id: number;
  time_post: Date;
  time_edit?: Date | null;
  title: string; // varchar(255)
  content: string; // text
  views: number;
  important: boolean; // tinyint(1)
  user_id: string; // char(8)
}
