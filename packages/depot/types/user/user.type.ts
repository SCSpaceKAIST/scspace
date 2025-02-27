import { UserTypeEnum } from "../../enums/user.enum";

export interface IUser {
  id: number;
  kaist_uid: string;
  user_sso_id: string | null;
  name_kr: string | null;
  name_en: string | null;
  user_number: string;
  email: string | null;
  type: UserTypeEnum;
}
export type IUserCreate = Omit<IUser, "id">;
