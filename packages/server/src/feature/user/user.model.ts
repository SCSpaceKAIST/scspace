import { IUser } from '@scspace-depot/types/user';
import { User } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type UserDBResult = InferSelectModel<typeof User>;

export class MUser implements IUser {
  id: IUser['id'];
  nameKr: IUser['nameKr'];
  nameEn: IUser['nameEn'];
  studentNumber: IUser['studentNumber'];
  email: IUser['email'];
  type: IUser['type'];
  timeOverdue: IUser['timeOverdue'];

  constructor(user: IUser) {
    this.id = user.id;
    this.nameKr = user.nameKr;
    this.nameEn = user.nameEn;
    this.studentNumber = user.studentNumber;
    this.email = user.email;
    this.type = user.type;
    this.timeOverdue = user.timeOverdue;
  }

  static fromDB(user: UserDBResult): IUser {
    return {
      id: user.id,
      nameKr: user.nameKr ?? 'SSO 이름 오류',
      nameEn: user.nameEn ?? 'SSO Name Error',
      studentNumber: user.studentNumber,
      email: user.email,
      type: user.type,
      timeOverdue: user.timeOverdue,
    };
  }
}
