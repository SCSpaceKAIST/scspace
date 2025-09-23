export interface IUser {
  id: number;
  studentNumber: number;
  nameKr: string;
  nameEn: string;
  email: string | null;
  type: number;
  timeOverdue: number;
}

export type IUserCreate = Omit<IUser, "id" | "timeOverdue">;
export type IUserUpdate = Partial<Pick<IUser, "type" | "timeOverdue">>;
