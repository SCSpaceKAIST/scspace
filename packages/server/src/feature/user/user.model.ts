import { IUser } from '@scspace-depot/types/user';
import { User } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type UserDBResult = InferSelectModel<typeof User>;

export class MUser implements IUser {
  id: IUser['id'];
  kaistUID: IUser['kaistUID'];
  nameKr: IUser['nameKr'];
  nameEn: IUser['nameEn'];
  userNumber: IUser['userNumber'];
  email: IUser['email'];
  type: IUser['type'];

  constructor(private readonly user: IUser) {
    Object.assign(this, user);
  }

  static fromDB(user: UserDBResult): MUser {
    return new MUser({
      ...user,
      nameKr: user.nameKr ?? 'SSO 이름 오류',
      nameEn: user.nameEn ?? 'SSO Name Error',
    });
  }
}
