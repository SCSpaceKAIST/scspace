export type IReservationContent =
  | IIndividualContent
  | IPianoContent
  | ISeminarContent
  | IDanceContent
  | IGroupContent
  | IMiraeContent
  | ISumiContent
  | IWorkContent
  | IOpenContent;

// Individual spaces
export interface IIndividualContent {
  eventName: string | null;
}

// Piano spaces
export interface IPianoContent {
  eventName: string | null; // Placeholder for unspecified structure
}

// Seminar spaces
export interface ISeminarContent {
  eventName: string;
  organizationName: string;
  contents: string;
  number: string;
}

// Dance spaces
export interface IDanceContent {
  eventName: string;
  contents: string;
  teamMember: string[];
}

// Group spaces
export interface IGroupContent {
  eventName: string;
  contents: string;
  teamMember: string[];
}

// Mirae spaces
export interface IMiraeContent {
  eventName: string;
  organizationName: string;
  contents: string;
  equipment: string[];
  innerNumber: number;
  outerNumber: number;
  eventPurpose: string;
  food: string;
  character: string[] | null;
}

// Sumi spaces
export interface ISumiContent {
  eventName: string;
  organizationName: string;
  contents: string;
  equipment: string[];
  innerNumber: number;
  outerNumber: number;
  eventPurpose: string;
  food: string;
  desk: number;
  chair: number;
  lobby: boolean;
  character: string[] | null;
}

// Work spaces
export interface IWorkContent {
  eventName: string;
  organizationName: string;
}

// Open spaces
export interface IOpenContent {
  eventName?: string;
  organizationName?: string;
  contents?: string;
  innerNumber?: number;
  outerNumber?: number;
  eventPurpose?: string;
  workComplete?: boolean | null;
}

export function isTeamContent(
  content: IReservationContent
): content is IDanceContent | IGroupContent {
  return "teamMember" in content;
}
