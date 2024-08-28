import { SpaceTypeEnum } from "./spaceType";

export type IntroTypeEnum = "introduction" | "usage" | "caution" | "shortintro";

// Table: space_introductions
export interface SpaceIntroductionType {
  id: number;
  space_type: SpaceTypeEnum;
  intro_type: IntroTypeEnum;
  info: any; // json
}
