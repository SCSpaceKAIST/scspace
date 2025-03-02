import { UserTypeEnum } from "../../enums/user.enum";

export interface IUser {
  id: number;
  kaistUID: string;
  nameKr: string;
  nameEn: string;
  userNumber: string | null;
  email: string | null;
  type: UserTypeEnum;
}
export type IUserCreate = Omit<IUser, "id">;
