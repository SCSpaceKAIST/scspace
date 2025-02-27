import { SpaceTypeEnum } from "../../enums/space.enum";
import { SpaceIntroductionTypeEnum } from "../../enums/space.enum";

export interface SpaceIntroductionOutputType {
  space_type: SpaceTypeEnum;
  introduction: IIntroduction;
  usage: IIntroduction;
  caution: IIntroduction;
  shortintro: IShortIntro;
}

// Table: space_introductions
export interface ISpaceIntroduction {
  id: number;
  space_type: SpaceTypeEnum;
  intro_type: SpaceIntroductionTypeEnum;
  info: IShortIntro | IIntroduction; // json
}

// Short Introduction 타입
export interface IShortIntro {
  shortintro: string;
}

// Introduction 타입
export interface IIntroduction {
  intro: string;
  content: IContentItem[];
}

// 공통으로 사용되는 Content Item 타입
export interface IContentItem {
  title: string;
  body: IBodyItem[];
}

// Body 아이템 타입
interface IBodyItem {
  head: string;
  list: string[];
}
