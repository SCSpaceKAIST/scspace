import { ISpace } from '@scspace-depot/types/space';
import { Space } from '@schema';
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
