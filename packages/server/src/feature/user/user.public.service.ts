import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { MUser } from './user.model';
import { UserTypeEnum } from '@scspace-depot/enums/user.enum';
import { IUser, IUserCreate } from '@scspace-depot/types/user';
import { UserService } from './user.service';

@Injectable()
export class UserPublicService {
  constructor(private readonly userRepository: UserRepository, private readonly userService: UserService) {}

  async fetchById(id: number): Promise<IUser | null> {
    if (id === 0) {
      throw new NotFoundException('User not found');
    }
    const user = await this.userRepository.fetch({ id: id });
    if (user.length === 0) {
      return null;
    }
    return MUser.fromDB(user[0]);
  }

  async fetchByStudentNumber(studentNumber: number): Promise<IUser | null> {
    const user = await this.userRepository.fetch({ studentNumber: studentNumber });
    if (user.length === 0) { 
      return null;
    }
    return MUser.fromDB(user[0]);
  }

  async fetchAllByIds(ids: number[]): Promise<IUser[]> {
    const uniqueIds = [...new Set(ids)];
    const users = await this.userRepository.fetch({ ids: uniqueIds });
    if (users.length !== uniqueIds.length) {
      throw new NotFoundException('Some users not found');
    }
    return users.map(MUser.fromDB);
  }

  async fetchAll(): Promise<IUser[]> {
    return (await this.userRepository.fetchAll()).map(MUser.fromDB);
  }

  async insert(user: IUserCreate): Promise<IUser> {
    return this.userService.insert(user);
  }

  async count(): Promise<number> {
    return (await this.userRepository.fetchAll()).length;
  }

  async isManager(userId: number): Promise<boolean> {
    const user = await this.fetchById(userId);
    return (
      user.type === UserTypeEnum.MANAGER ||
      user.type === UserTypeEnum.ADMIN
    );
  }

}
