export type ReservationContentTypeEnum =
  | IndividualContentType
  | PianoContentType
  | SeminarContentType
  | DanceContentType
  | GroupContentType
  | MiraeContentType
  | SumiContentType
  | WorkContentType
  | OpenContentType;

// Individual spaces
export interface IndividualContentType {
  eventName: string | null;
}

// Piano spaces
export interface PianoContentType {
  eventName: string | null; // Placeholder for unspecified structure
}

// Seminar spaces
export interface SeminarContentType {
  eventName: string;
  organizationName: string;
  contents: string;
  number: string;
}

// Dance spaces
export interface DanceContentType {
  eventName: string;
  contents: string;
  teamMember: string[];
}

// Group spaces
export interface GroupContentType {
  eventName: string;
  contents: string;
  teamMember: string[];
}

// Mirae spaces
export interface MiraeContentType {
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
export interface SumiContentType {
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
export interface WorkContentType {
  eventName: string;
  organizationName: string;
}

// Open spaces
export interface OpenContentType {
  eventName?: string;
  organizationName?: string;
  contents?: string;
  innerNumber?: number;
  outerNumber?: number;
  eventPurpose?: string;
  workComplete?: boolean | null;
}

export function isTeamContent(
  content: ReservationContentTypeEnum
): content is DanceContentType | GroupContentType {
  return "teamMember" in content;
}
