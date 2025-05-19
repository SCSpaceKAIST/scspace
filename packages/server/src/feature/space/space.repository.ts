import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema, Space } from '@schema';
import { and, eq, inArray, SQL } from 'drizzle-orm';
import { MSpace } from './space.model';
import { SpaceTypeEnum } from '@scspace-depot/enums/space.enum';

@Injectable()
export class SpaceRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async fetch(id: number): Promise<MSpace> {
    const space = await this.db
      .select()
      .from(Space)
      .where(eq(Space.id, id))
      .then((spaces) => spaces[0]);

    if (!space) {
      throw new NotFoundException(`Space with id ${id} not found`);
    }

    return MSpace.fromDB(space);
  }

  async fetchAll(): Promise<MSpace[]>;
  async fetchAll(ids: number[]): Promise<MSpace[]>;
  async fetchAll(spaceType: SpaceTypeEnum): Promise<MSpace[]>;
  async fetchAll(arg?: number[] | SpaceTypeEnum): Promise<MSpace[]> {
    const whereConditions: SQL[] = [];

    if (Array.isArray(arg)) {
      const uniqueIds = [...new Set(arg)];
      whereConditions.push(inArray(Space.id, uniqueIds));
    } else if (arg !== undefined) {
      whereConditions.push(eq(Space.spaceType, arg));
    }

    const spaces = await this.db
      .select()
      .from(Space)
      .where(and(...whereConditions));

    return spaces.map((space) => MSpace.fromDB(space));
  }

  // async getSpaceIntroByTypes(
  //   spaceType: SpaceTypeEnum,
  // ): Promise<SpaceIntroductionType[] | false> {
  //   const result = (await this.db
  //     .select()
  //     .from(schema.space_introductions)
  //     .where(
  //       eq(schema.space_introductions.spaceType, spaceType),
  //     )) as SpaceIntroductionType[];
  //   Logger.log('SpaceIntro by Type ' + JSON.stringify(result));
  //   return result.length > 0 ? result : false;
  // }

  // async getSpaceIntroIByTypes(
  //   //introduction
  //   spaceType: SpaceTypeEnum,
  //   introType: IntroTypeEnum,
  // ): Promise<IntroductionType | ShortIntroType | false> {
  //   Logger.log(
  //     'SpaceIntro by introType ' + JSON.stringify([spaceType, introType]),
  //   );
  //   const result = (await this.db
  //     .select()
  //     .from(schema.space_introductions)
  //     .where(
  //       and(
  //         eq(schema.space_introductions.spaceType, spaceType),
  //         eq(schema.space_introductions.introType, introType),
  //       ),
  //     )) as SpaceIntroductionType[];
  //   Logger.log('SpaceIntro by introType ' + JSON.stringify(result));
  //   if (!result) return false;
  //   else {
  //     return result[0].info;
  //   }
  // }
}
