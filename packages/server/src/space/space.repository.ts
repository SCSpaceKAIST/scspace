import { Injectable, Inject, Logger } from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from '@schema';
import { and, eq } from 'drizzle-orm';
import {
  ContentItem,
  IntroTypeEnum,
  IntroductionType,
  ShortIntroType,
  SpaceIntroductionType,
  SpaceType,
  SpaceTypeEnum,
} from '@depot/types/space';

@Injectable()
export class SpaceRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async getSpaceById(space_id: number): Promise<SpaceType | false> {
    const result = (await this.db
      .select()
      .from(schema.spaces)
      .where(eq(schema.spaces, space_id))) as SpaceType[];
    Logger.log('Space ' + JSON.stringify(result));
    return result ? result[0] : false;
  }

  async getSpaceIntroByTypes(
    space_type: SpaceTypeEnum,
  ): Promise<SpaceIntroductionType[] | false> {
    const result = (await this.db
      .select()
      .from(schema.space_introductions)
      .where(
        eq(schema.space_introductions.space_type, space_type),
      )) as SpaceIntroductionType[];
    Logger.log('SpaceIntro by Type ' + JSON.stringify(result));
    return result.length > 0 ? result : false;
  }

  async getSpaceIntroIByTypes(
    //introduction
    space_type: SpaceTypeEnum,
    intro_type: IntroTypeEnum,
  ): Promise<IntroductionType | ShortIntroType | false> {
    Logger.log(
      'SpaceIntro by introType ' + JSON.stringify([space_type, intro_type]),
    );
    const result = (await this.db
      .select()
      .from(schema.space_introductions)
      .where(
        and(
          eq(schema.space_introductions.space_type, space_type),
          eq(schema.space_introductions.intro_type, intro_type),
        ),
      )) as SpaceIntroductionType[];
    Logger.log('SpaceIntro by introType ' + JSON.stringify(result));
    if (!result) return false;
    else {
      return result[0].info;
    }
  }
}
