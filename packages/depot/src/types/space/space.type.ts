import { SpaceTypeEnum } from "../../enums/space.enum";

// Table: spaces
export interface ISpace {
  id: number;
  name: string; // varchar(100)
  nameEng: string; // varchar(100)
  spaceType: SpaceTypeEnum;
}

export const SpaceTypesArray = [
  SpaceTypeEnum.INDIVIDUAL,
  SpaceTypeEnum.PIANO,
  SpaceTypeEnum.SEMINAR,
  SpaceTypeEnum.DANCE,
  SpaceTypeEnum.GROUP,
  SpaceTypeEnum.MIRAE,
  SpaceTypeEnum.SUMI,
  SpaceTypeEnum.OPEN,
  SpaceTypeEnum.WORK,
] as SpaceTypeEnum[];

export const SpaceTypeNames = {
  [SpaceTypeEnum.INDIVIDUAL]: "개인연습실",
  [SpaceTypeEnum.PIANO]: "피아노실",
  [SpaceTypeEnum.SEMINAR]: "세미나실",
  [SpaceTypeEnum.DANCE]: "무예실",
  [SpaceTypeEnum.GROUP]: "합주실",
  [SpaceTypeEnum.MIRAE]: "미래홀",
  [SpaceTypeEnum.SUMI]: "조수미홀",
  [SpaceTypeEnum.OPEN]: "오픈 스페이스",
  [SpaceTypeEnum.WORK]: "창작공방",
};
