export type AskStateEnum = "wait" | "receive" | "solve";

// Table: asks
export interface AsksType {
  id: number;
  user_id: string; // char(8)
  time_post: Date;
  time_edit?: Date | null;
  title: string; // varchar(255)
  content: string; // text
  views: number;
  state: AskStateEnum;
  comment: string; // text
  commenter_id: string; // char(8)
}
