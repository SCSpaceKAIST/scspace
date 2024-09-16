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
  number: string;
  contents: string;
  eventName: string;
  organizationName: string;
}

// Dance spaces
export interface DanceContentType {
  contents: string;
  eventName: string;
  teamMember: string[];
}

// Group spaces
export interface GroupContentType {
  contents: string;
  eventName: string;
  teamMember: string[];
}

// Mirae spaces
export interface MiraeContentType {
  food: string;
  contents: string;
  equipment: string[];
  eventName: string;
  innerNumber: number;
  outerNumber: number;
  eventPurpose: string;
  organizationName: string;
}

// Sumi spaces
export interface SumiContentType {
  desk: number;
  chair: number;
  food: string;
  lobby: boolean;
  contents: string;
  equipment: string[];
  eventName: string;
  innerNumber: number;
  outerNumber: number;
  eventPurpose: string;
  organizationName: string;
}

// Work spaces
export interface WorkContentType {
  eventName: string;
  organizationName: string;
}

// Open spaces
export interface OpenContentType {
  contents?: string;
  eventName?: string;
  innerNumber?: number;
  outerNumber?: number;
  eventPurpose?: string;
  workComplete?: boolean | null;
  organizationName?: string;
}
