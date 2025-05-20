import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { MUser } from './user.model';
import { UserTypeEnum } from '@scspace-depot/enums/user.enum';
import { IUserCreate } from '@scspace-depot/types/user';

@Injectable()
export class UserPublicService {
  constructor(private readonly userRepository: UserRepository) {}

  async fetchUser(id: number): Promise<MUser> {
    return await this.userRepository.fetch(id);
  }

  async findUserByStudentNumber(studentNumber: number): Promise<MUser | null> {
    const users = await this.userRepository.find({ studentNumber });
    return users.length > 0 ? users[0] : null;
  }

  async fetchAllByIds(ids: number[]): Promise<MUser[]> {
    return await this.userRepository.fetchAllByIds(ids);
  }

  async fetchAll(): Promise<MUser[]> {
    return await this.userRepository.fetchAll();
  }

  async find(params: { id?: number; ids?: number[]; studentNumber?: number }): Promise<MUser[]> {
    return await this.userRepository.find(params);
  }

  async isManager(userId: number): Promise<boolean> {
    const user = await this.fetchUser(userId);
    return (
      user.type === UserTypeEnum.MANAGER ||
      user.type === UserTypeEnum.ADMIN
    );
  }

  async checkManager(userId: number): Promise<void> {
    const flag = await this.isManager(userId);
    if (!flag) {
      throw new BadRequestException(`User ID ${userId} is not a manager.`);
    }
  }

  async insertUser(user: IUserCreate): Promise<MUser> {
    return await this.userRepository.insert(user);
  }

  async getUserCount(): Promise<number> {
    return (await this.userRepository.find({})).length;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result;
  }
}
