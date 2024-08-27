import { UserType } from "./userType";
export type UserTypeWithoutID = Omit<UserType, "id">;
