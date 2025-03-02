import { AskStateEnum } from "../../enums/ask.enum";
import { IUser } from "../user";

// Table: asks
export interface IAsk {
  id: number;
  userId: number; // char(8)
  timePost: Date;
  timeEdit?: Date | null;
  title: string; // varchar(255)
  content: string; // text
  views: number;
  state: AskStateEnum;
  comment: string | null; // text
  commenterId: number | null; // userId
}

export type IAskCreate = Omit<
  IAsk,
  | "id"
  | "timePost"
  | "timeEdit"
  | "views"
  | "state"
  | "comment"
  | "commenterId"
>;

export type IAskCommentCreate = Pick<
  IAsk,
  "id" | "comment" | "commenterId" | "state"
>;

export type IAskResponse = IAsk & {
  user: IUser;
  commenter: IUser | null;
};

export const askStateOptions: { [key in AskStateEnum]: string } = {
  [AskStateEnum.WAIT]: "대기중",
  [AskStateEnum.RECEIVE]: "접수됨",
  [AskStateEnum.SOLVE]: "해결됨",
};
