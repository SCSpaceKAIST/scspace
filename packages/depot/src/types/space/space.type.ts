import { SpaceTypeEnum } from "../../enums/space.enum";

// Table: space
export interface ISpace {
  id: number;
  nameKr: string;
  nameEn: string;
  spaceType: SpaceTypeEnum;
}