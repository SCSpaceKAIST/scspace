import { Injectable } from '@nestjs/common';
import { SpaceRepository } from './space.repository';
import { ISpace, ISpaceIntroduction } from '@scspace-depot/types/space';

@Injectable()
export class SpaceService {
  constructor(private readonly spaceRepository: SpaceRepository) {}

  async getSpaceByID(spaceId: number): Promise<ISpace> {
    return await this.spaceRepository.fetch(spaceId);
  }

  async getSpaceIntroByID(spaceId: number): Promise<ISpaceIntroduction> {
    return await this.spaceRepository.fetch(spaceId);
  }

  async getSpaceAll(): Promise<ISpace[]> {
    return await this.spaceRepository.fetchAll();
  }


  // 공간 소개 페이지를 만드는 부분
  // 나중에 잘 만들어주세요 개발팀 화이팅!

  // async getSpaceIntroByID(
  //   spaceType_id: number,
  // ): Promise<SpaceIntroductionOutputType | false> {
  //   const res = {
  //     spaceType: SpaceTypesArray[spaceType_id],
  //     introduction: await this.spaceRepository.getSpaceIntroIByTypes(
  //       SpaceTypesArray[spaceType_id],
  //       'introduction',
  //     ),

  //     usage: await this.spaceRepository.getSpaceIntroIByTypes(
  //       SpaceTypesArray[spaceType_id] as SpaceTypeEnum,
  //       'usage',
  //     ),
  //     caution: await this.spaceRepository.getSpaceIntroIByTypes(
  //       SpaceTypesArray[spaceType_id] as SpaceTypeEnum,
  //       'caution',
  //     ),
  //     shortintro: await this.spaceRepository.getSpaceIntroIByTypes(
  //       SpaceTypesArray[spaceType_id] as SpaceTypeEnum,
  //       'shortintro',
  //     ),
  //   };

  //   if (!res.introduction || !res.usage || !res.caution || !res.shortintro)
  //     return false;
  //   else return { ...res } as SpaceIntroductionOutputType;
  // }
}
