export type SpaceTypeEnum =
  | "individual"
  | "piano"
  | "seminar"
  | "dance"
  | "group"
  | "mirae"
  | "sumi"
  | "open"
  | "work";

// Table: spaces
export interface SpaceType {
  space_id: number;
  name: string; // varchar(100)
  name_eng: string; // varchar(100)
  space_type: SpaceTypeEnum;
}
