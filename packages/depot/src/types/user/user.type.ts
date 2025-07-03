import { UserTypeEnum } from "../../enums/user.enum";

export interface IUser {
  id: number;
  studentNumber: number;
  nameKr: string;
  nameEn: string;
  email: string | null;
  type: UserTypeEnum;
}

export type IUserCreate = Omit<IUser, "id">;
export type IUserUpdate = Pick<IUser, "type">;
