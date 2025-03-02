import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { MUser } from './user.model';
import { UserTypeEnum } from '@depot/enums/user.enum';

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
}
