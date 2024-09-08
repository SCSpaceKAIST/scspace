// Table: passwords
export interface PasswordType {
  id: number;
  password: string; // char(10)
  space_id: number;
  time_edit: Date;
  changed: boolean; // tinyint(1)
}
