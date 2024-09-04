import { SpaceTypeEnum } from "./spaceType";

export type IntroTypeEnum = "introduction" | "usage" | "caution" | "shortintro";

export interface SpaceIntroductionOutputType {
  space_type: SpaceTypeEnum;
  introduction: IntroductionType;
  usage: IntroductionType;
  caution: IntroductionType;
  shortintro: ShortIntroType;
}

// Table: space_introductions
export interface SpaceIntroductionType {
  id: number;
  space_type: SpaceTypeEnum;
  intro_type: IntroTypeEnum;
  info: ShortIntroType | IntroductionType; // json
}

// Short Introduction 타입
export interface ShortIntroType {
  shortintro: string;
}

// Introduction 타입
export interface IntroductionType {
  intro: string;
  content: ContentItem[];
}

// 공통으로 사용되는 Content Item 타입
export interface ContentItem {
  title: string;
  body: BodyItem[];
}

// Body 아이템 타입
interface BodyItem {
  head: string;
  list: string[];
}
