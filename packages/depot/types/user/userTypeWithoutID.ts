import { UserType } from "./userType";

// 'id' 속성을 제외한 타입을 생성
export type UserTypeWithoutID = Omit<UserType, "id">;
