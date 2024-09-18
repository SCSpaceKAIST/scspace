// Table: passwords
export interface PasswordType {
  id: number;
  password: string; // char(10)
  space_id: number;
  time_post: Date;
  time_edit: Date;
  changed: number; // tinyint(1)
  user_id: string | null; // char(8)
}

export interface PasswordValidationType {
  space_id: number;
  valid: boolean;
}
