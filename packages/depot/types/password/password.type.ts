// Table: passwords
export interface IPassword {
  id: number;
  password: string; // char(10)
  space_id: number;
  time_post: Date;
  time_edit: Date;
  changed: number; // tinyint(1)
  user_id: number | null; // char(8)
}

export interface IPasswordValidation {
  space_id: number;
  valid: boolean;
}

