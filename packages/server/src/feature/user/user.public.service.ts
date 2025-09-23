import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { MUser } from './user.model';
import { IUser, IUserCreate, IUserUpdate } from '@scspace-depot/types/user';
import { UserService } from './user.service';
import { UserUtils } from '@scspace-depot/utils/user.utils';

@Injectable()
export class UserPublicService {
  constructor(private readonly userRepository: UserRepository, private readonly userService: UserService) { }

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
      throw new NotFoundException(`Some users not found: ${users} | ${uniqueIds}`);
    }
    return users.map(MUser.fromDB);
  }

  async fetchAll(studentNumber: number): Promise<IUser[]> {
    return (await this.userRepository.fetchAll(studentNumber)).map(MUser.fromDB);
  }

  /**
   * @param type : use type ENUM - worker, admin, manager, etc
   */
  async fetchAllWorker(): Promise<IUser[]> {
    return (await this.userRepository.fetchAllWorker())
  }

  async insert(user: IUserCreate): Promise<IUser> {
    return this.userService.insert(user);
  }

  async count(): Promise<number> {
    return (await this.userRepository.fetchAll(0)).length;
  }

  async isManager(userId: number): Promise<boolean> {
    const user = await this.fetchById(userId);
    return UserUtils.isManager(user.type);
  }

  async updateOverdue(id: number, user: Pick<IUserUpdate, "timeOverdue">): Promise<IUser> {
    return this.userService.update(id, user);
  }

}
