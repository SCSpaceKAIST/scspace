import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser } from '@depot/types/user';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(userId: number): Promise<IUser> {
    return await this.userRepository.fetch(userId);
  }
}
