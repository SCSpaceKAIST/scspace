import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { MUser } from './user.model';
import { IUser, IUserCreate } from '@scspace-depot/types/user';
import { ISuccessResponse } from '@scspace-depot/types/common';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {
  }

  async insert(user: IUserCreate): Promise<IUser> {
    const userExist = await this.userRepository.fetch({ studentNumber: user.studentNumber });
    if (userExist.length > 0) {
      throw new BadRequestException('User already exists');
    }
    const newUser = MUser.fromDB(await this.userRepository.insert(user));
    return newUser;
  }

  async delete(id: number): Promise<ISuccessResponse> {
    const userExist = await this.userRepository.fetch({ id });
    if (userExist.length === 0) {
      throw new BadRequestException(`User ID ${id} not found.`);
    }
    await this.userRepository.delete(id);
    return { success: true };
  }
}