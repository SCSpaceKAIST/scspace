// Table: passwords
export interface IPassword {
  id: number;
  password: string; // char(10)
  spaceId: number;
  timePost: Date;
  timeEdit: Date | null;
  changed: boolean; // boolean
  userId: number | null; // char(8)
}

export interface IPasswordValidation {
  spaceId: number;
  valid: boolean;
}

