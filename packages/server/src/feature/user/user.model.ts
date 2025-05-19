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

  constructor(user: IUser) {
    this.id = user.id;
    this.nameKr = user.nameKr;
    this.nameEn = user.nameEn;
    this.studentNumber = user.studentNumber;
    this.email = user.email;
    this.type = user.type;
  }

  static fromDB(user: UserDBResult): MUser {
    return new MUser({
      id: user.id,
      nameKr: user.nameKr ?? 'SSO 이름 오류',
      nameEn: user.nameEn ?? 'SSO Name Error',
      studentNumber: user.studentNumber,
      email: user.email,
      type: user.type,
    });
  }
}
