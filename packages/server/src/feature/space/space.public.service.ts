import { Injectable } from '@nestjs/common';
import { SpaceRepository } from './space.repository';
import { ISpace } from '@scspace-depot/types/space';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';

@Injectable()
export class SpacePublicService {
  constructor(
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async fetchById(id: number): Promise<ISpace | null> {
    const space = await this.spaceRepository.fetch(id);
    if (!space) {
      return null;
    }
    return space;
  }

  async fetchAllByIds(ids: number[]): Promise<ISpace[]> {
    return await this.spaceRepository.fetchAll(ids);
  }

  async fetchAllBySpaceType(spaceType: SpaceTypeEnum): Promise<ISpace[]> {
    return await this.spaceRepository.fetchAll(spaceType);
  }

  async fetchAll(): Promise<ISpace[]> {
    return await this.spaceRepository.fetchAll();
  }

  async count(): Promise<number> {
    return (await this.spaceRepository.fetchAll()).length;
  }
}
