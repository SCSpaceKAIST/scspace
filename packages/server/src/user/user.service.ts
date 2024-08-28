import { Injectable, Inject } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { UserRepository } from './user.repository';
import { stringify } from 'querystring';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(user_id: string) {
    return await this.userRepository.getUser(user_id);
  }

  async getUserNameWithToken(): Promise<string> {
    return '';
  }
}
