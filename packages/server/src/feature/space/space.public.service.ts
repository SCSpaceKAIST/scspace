import { Injectable } from '@nestjs/common';
import { SpaceRepository } from './space.repository';
import { MSpace } from './space.model';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';

@Injectable()
export class SpacePublicService {
  constructor(private readonly spaceRepository: SpaceRepository) {}

  async fetchSpace(id: number): Promise<MSpace> {
    return await this.spaceRepository.fetch(id);
  }

  async fetchSpaceAll(ids: number[]): Promise<MSpace[]> {
    return await this.spaceRepository.fetchAll(ids);
  }

  async fetchSpaceAllBySpaceType(spaceType: SpaceTypeEnum): Promise<MSpace[]> {
    return await this.spaceRepository.fetchAll(spaceType);
  }

  async findAll(): Promise<MSpace[]> {
    return await this.spaceRepository.findSpace({});
  }

  async getSpaceCount(): Promise<number> {
    return (await this.spaceRepository.findSpace({})).length;
  }
}
