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

  async findUserByKaistUid(kaistUid: string): Promise<MUser | null> {
    return await this.userRepository.find(kaistUid);
  }

  async fetchAll(ids: number[]): Promise<MUser[]> {
    return await this.userRepository.fetchAll(ids);
  }

  async find(params: { id?: number; ids?: number[] }): Promise<MUser[]> {
    const result = await this.userRepository.find(params);
    return result;
  }

  async isManager(userId: number): Promise<boolean> {
    const user = await this.fetchUser(userId);
    return (
      user.type === UserTypeEnum.MANAGER ||
      user.type === UserTypeEnum.ADMIN ||
      user.type === UserTypeEnum.CHIEF
    );
  }

  async checkManager(userId: number): Promise<void> {
    const flag = await this.isManager(userId);
    if (!flag)
      throw new BadRequestException(`User ID ${userId} is not a manager.`);
  }

  async insertUser(user: IUserCreate): Promise<MUser> {
    return await this.userRepository.insert(user);
  }

  async getUserCount(): Promise<number> {
    return (await this.userRepository.find({})).length;
  }
}
