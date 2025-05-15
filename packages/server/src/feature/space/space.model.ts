import { ISpace, ISpaceIntroduction } from '@scspace-depot/types/space';
import { Space, SpaceIntroduction } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type SpaceDBResult = InferSelectModel<typeof Space>;

export class MSpace implements ISpace {
  id: ISpace['id'];
  name: ISpace['name'];
  nameEng: ISpace['nameEng'];
  spaceType: ISpace['spaceType'];

  constructor(private readonly space: ISpace) {
    Object.assign(this, space);
  }

  static fromDB(space: SpaceDBResult): MSpace {
    return new MSpace({
      ...space,
    });
  }
}

export class MSpaceIntroduction implements ISpaceIntroduction {
  id: ISpaceIntroduction['id'];
  spaceType: ISpaceIntroduction['spaceType'];
  introType: ISpaceIntroduction['introType'];
  info: ISpaceIntroduction['info'];

  constructor(private readonly spaceIntro: ISpaceIntroduction) {
    Object.assign(this, spaceIntro);
  }

  static fromDB(spaceIntro: SpaceIntroduction): MSpaceIntroduction {
    return new MSpaceIntroduction({
      ...spaceIntro,
    });
  }
}
