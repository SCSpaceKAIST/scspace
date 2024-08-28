export type UserTypeEnum = "user" | "manager" | "admin" | "chief";

export interface UserType {
  id: number;
  user_id: string;
  name: string;
  email: string;
  type: UserTypeEnum;
}
