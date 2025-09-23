import { ISpace } from '@scspace-depot/types/space';
import { Space } from '@schema';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';
import { InferSelectModel } from 'drizzle-orm';

type SpaceDBResult = InferSelectModel<typeof Space>;

export class MSpace implements ISpace {
  id: ISpace['id'];
  nameKr: ISpace['nameKr'];
  nameEn: ISpace['nameEn'];
  spaceType: ISpace['spaceType'];

  constructor(data: ISpace) {
    this.id = data.id;
    this.nameKr = data.nameKr;
    this.nameEn = data.nameEn;
    this.spaceType = data.spaceType;
  }

  static fromDB(space: SpaceDBResult): ISpace {
    return {
      id: space.id,
      nameKr: space.nameKr,
      nameEn: space.nameEn,
      spaceType: space.spaceType as SpaceTypeEnum,
    };
  }
}