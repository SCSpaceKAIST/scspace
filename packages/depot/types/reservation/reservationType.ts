export type ReservationStateEnum = "grant" | "wait" | "rejected" | "received";
export type WorkerNeedEnum =
  | "unnecessary"
  | "required"
  | "completed"
  | "failed";

// Table: reservations
export interface ReservationType {
  reservation_id: number;
  user_id: string; // char(8)
  team_id?: number | null;
  space_id: number;
  time_from: Date;
  time_to: Date;
  time_post: Date;
  content: Object | null; // json
  comment: string | null; // varchar(300)
  state: ReservationStateEnum;
  worker_need: WorkerNeedEnum;
}

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
  [key: string]: any; // Placeholder for unspecified structure
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
  workTo: string | null;
  contents: string;
  workFrom: string | null;
  equipment: string[];
  eventName: string;
  rehersalTo: string | null;
  innerNumber: number;
  outerNumber: number;
  eventPurpose: string;
  inner_number: string;
  outer_number: string;
  rehersalFrom: string | null;
  workComplete: boolean | null;
  organizationName: string;
}

// Sumi spaces
export interface SumiContentType {
  desk: string;
  food: string;
  chair: string;
  lobby: any[]; // Placeholder for unspecified structure
  workTo: string;
  contents: string;
  workFrom: string;
  equipment: string[];
  eventName: string;
  rehersalTo: string | null;
  innerNumber: number;
  outerNumber: number;
  eventPurpose: string;
  inner_number: string;
  outer_number: string;
  rehersalFrom: string | null;
  workComplete: boolean;
  organizationName: string;
}

// Work spaces
export interface WorkContentType {
  eventName: string;
  organizationName: string;
}

// Open spaces
export interface OpenContentType {
  space?: string[];
  contents?: string;
  character?: any[]; // Placeholder for unspecified structure
  eventName?: string;
  rehersalTo?: string | null;
  innerNumber?: number;
  outerNumber?: number;
  eventPurpose?: string;
  inner_number?: string;
  outer_number?: string;
  rehersalFrom?: string | null;
  workComplete?: boolean | null;
  organizationName?: string;
}
