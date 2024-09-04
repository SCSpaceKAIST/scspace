import { Injectable } from '@nestjs/common';
import { SpaceRepository } from './space.repository';
import {
  IntroductionType,
  SpaceIntroductionOutputType,
  SpaceType,
  SpaceTypeEnum,
  SpaceTypesArray,
} from '@depot/types/space';

@Injectable()
export class SpaceService {
  constructor(private readonly spaceRepository: SpaceRepository) {}

  async getSpaceByID(space_id: number): Promise<SpaceType | false> {
    return await this.spaceRepository.getSpaceById(space_id);
  }

  async getSpaceIntroByID(
    space_type_id: number,
  ): Promise<SpaceIntroductionOutputType | false> {
    const res = {
      space_type: SpaceTypesArray[space_type_id],
      introduction: await this.spaceRepository.getSpaceIntroIByTypes(
        SpaceTypesArray[space_type_id],
        'introduction',
      ),

      usage: await this.spaceRepository.getSpaceIntroIByTypes(
        SpaceTypesArray[space_type_id] as SpaceTypeEnum,
        'usage',
      ),
      caution: await this.spaceRepository.getSpaceIntroIByTypes(
        SpaceTypesArray[space_type_id] as SpaceTypeEnum,
        'caution',
      ),
      shortintro: await this.spaceRepository.getSpaceIntroIByTypes(
        SpaceTypesArray[space_type_id] as SpaceTypeEnum,
        'shortintro',
      ),
    };

    if (!res.introduction || !res.usage || !res.caution || !res.shortintro)
      return false;
    else return { ...res } as SpaceIntroductionOutputType;
  }
}
