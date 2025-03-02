import { IPassword } from '@depot/types/password';
import { Password } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type PasswordDBResult = InferSelectModel<typeof Password>;

export class MPassword implements IPassword {
  id: IPassword['id'];
  spaceId: IPassword['spaceId'];
  password: IPassword['password'];
  timePost: IPassword['timePost'];
  timeEdit: IPassword['timeEdit'];
  changed: IPassword['changed'];
  userId: IPassword['userId'];

  constructor(private readonly data: IPassword) {
    Object.assign(this, data);
  }

  static fromDB(password: PasswordDBResult): MPassword {
    return new MPassword({ ...password });
  }
}
