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

export const SpaceTypesArray = [
  "individual",
  "piano",
  "seminar",
  "dance",
  "group",
  "mirae",
  "sumi",
  "open",
  "work",
] as SpaceTypeEnum[];

export const SpaceTypeNames = {
  individual: "개인연습실",
  piano: "피아노실",
  seminar: "세미나실",
  dance: "무예실",
  group: "합주실",
  mirae: "미래홀",
  sumi: "조수미홀",
  open: "오픈 스페이스",
  work: "창작공방",
};
