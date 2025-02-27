import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

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
