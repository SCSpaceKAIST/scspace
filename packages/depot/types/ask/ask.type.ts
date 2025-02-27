import { AskStateEnum } from "../../enums/ask.enum";

// Table: asks
export interface IAsk {
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

export type IAskCreate = Omit<
  IAsk,
  | "id"
  | "time_post"
  | "time_edit"
  | "views"
  | "state"
  | "comment"
  | "commenter_id"
>;

export const askStateOptions: { [key in AskStateEnum]: string } = {
  [AskStateEnum.WAIT]: "대기중",
  [AskStateEnum.RECEIVE]: "접수됨",
  [AskStateEnum.SOLVE]: "해결됨",
};
