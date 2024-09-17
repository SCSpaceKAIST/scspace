export type AskStateEnum = "wait" | "receive" | "solve";

// Table: asks
export interface AskType {
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

export type AskInputType = Omit<
  AskType,
  | "id"
  | "time_post"
  | "time_edit"
  | "views"
  | "state"
  | "comment"
  | "commenter_id"
>;

export const askStateOptions: { [key in AskStateEnum]: string } = {
  wait: "대기중",
  receive: "접수됨",
  solve: "해결됨",
};
