export interface UserType {
  id: number;
  user_id: string;
  name: string;
  email: string;
  type: "user" | "manager" | "admin" | "chief";
}
