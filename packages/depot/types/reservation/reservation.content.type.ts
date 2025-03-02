import { ReservationCharacterEnum, ReservationHallEquipEnum } from "../../enums/reservation.enum";
import { SpaceTypeEnum } from "../../enums/space.enum";

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
  eventName: string;
}

// Piano spaces
export interface IPianoContent {
  eventName: string; // Placeholder for unspecified structure
}

// Seminar spaces
export interface ISeminarContent {
  eventName: string;
  organizationName: string;
  contents: string;
  participantNumber: number;
}

// Dance spaces
export interface IDanceContent {
  eventName: string;
  contents: string;
  teamMemberUserIds: number[];
}

// Group spaces
export interface IGroupContent {
  eventName: string;
  contents: string;
  teamMemberUserIds: number[];
}

// Mirae spaces
export interface IMiraeContent {
  eventName: string;
  organizationName: string;
  contents: string;
  equipment: ReservationHallEquipEnum[];
  innerNumber: number;
  outerNumber: number;
  eventPurpose: string;
  food: string;
  character: ReservationCharacterEnum[];
}

// Sumi spaces
export interface ISumiContent {
  eventName: string;
  organizationName: string;
  contents: string;
  equipment: ReservationHallEquipEnum[];
  innerParticipantNumber: number;
  outerParticipantNumber: number;
  eventPurpose: string;
  food: string;
  desk: number;
  chair: number;
  lobby: boolean;
  character: ReservationCharacterEnum[];
}

// Work spaces
export interface IWorkContent {
  eventName: string;
  organizationName: string;
}

// Open spaces
export interface IOpenContent {
  eventName: string;
  organizationName: string;
  contents: string;
  innerParticipantNumber: number;
  outerParticipantNumber: number;
  eventPurpose: string;
  workComplete: boolean | null;
}

export interface ITotalContent extends IIndividualContent, IPianoContent, ISeminarContent, IDanceContent, IGroupContent, IMiraeContent, ISumiContent, IWorkContent, IOpenContent {}

export function isTeamContent(
  content: IReservationContent
): content is IDanceContent | IGroupContent {
  return "teamMemberUserIds" in content;
}

export function isHallContent(
  content: IReservationContent
): content is IMiraeContent | ISumiContent {
  return "equipment" in content && "character" in content;
}

// 예약 내용이 content 타입인지 검사
// zod 쓰자 제발...
export function isValidReservationContent(
  content: any,
  type?: SpaceTypeEnum
): content is IReservationContent {
  
  if (typeof content !== "object") return false;

  if (type === SpaceTypeEnum.INDIVIDUAL) {
    return isValidReservationContentProperty(content, "eventName");
  }
  if (type === SpaceTypeEnum.PIANO) {
    return isValidReservationContentProperty(content, "eventName");
  }
  if (type === SpaceTypeEnum.SEMINAR) {
    return isValidReservationContentProperty(content, "eventName") &&
      isValidReservationContentProperty(content, "organizationName") &&
      isValidReservationContentProperty(content, "contents") &&
      isValidReservationContentProperty(content, "participantNumber");
  }
  if (type === SpaceTypeEnum.DANCE) {
    return isValidReservationContentProperty(content, "eventName") &&
      isValidReservationContentProperty(content, "contents") &&
      isValidReservationContentProperty(content, "teamMemberUserIds");
  }
  if (type === SpaceTypeEnum.GROUP) {
    return isValidReservationContentProperty(content, "eventName") &&
      isValidReservationContentProperty(content, "contents") &&
      isValidReservationContentProperty(content, "teamMemberUserIds");
  }
  if (type === SpaceTypeEnum.MIRAE) {
    return isValidReservationContentProperty(content, "eventName") &&
      isValidReservationContentProperty(content, "organizationName") &&
      isValidReservationContentProperty(content, "contents") &&
      isValidReservationContentProperty(content, "equipment");
  }
  if (type === SpaceTypeEnum.SUMI) {
    return isValidReservationContentProperty(content, "eventName") &&
      isValidReservationContentProperty(content, "organizationName") &&
      isValidReservationContentProperty(content, "contents") &&
      isValidReservationContentProperty(content, "equipment") &&
      isValidReservationContentProperty(content, "innerParticipantNumber") &&
      isValidReservationContentProperty(content, "outerParticipantNumber") &&
      isValidReservationContentProperty(content, "eventPurpose") &&
      isValidReservationContentProperty(content, "food") &&
      isValidReservationContentProperty(content, "desk") &&
      isValidReservationContentProperty(content, "chair") &&
      isValidReservationContentProperty(content, "lobby") &&
      isValidReservationContentProperty(content, "character");
  }
  if (type === SpaceTypeEnum.WORK) {
    return isValidReservationContentProperty(content, "eventName") &&
      isValidReservationContentProperty(content, "organizationName");
  }
  if (type === SpaceTypeEnum.OPEN) {
    return isValidReservationContentProperty(content, "eventName") &&
      isValidReservationContentProperty(content, "organizationName") &&
      isValidReservationContentProperty(content, "contents") &&
      isValidReservationContentProperty(content, "innerParticipantNumber") &&
      isValidReservationContentProperty(content, "outerParticipantNumber") &&
      isValidReservationContentProperty(content, "eventPurpose") &&
      isValidReservationContentProperty(content, "workComplete");
  }
  
  if (!type){
    return isValidReservationContent(content, SpaceTypeEnum.INDIVIDUAL) ||
      isValidReservationContent(content, SpaceTypeEnum.PIANO) ||
      isValidReservationContent(content, SpaceTypeEnum.SEMINAR) ||
      isValidReservationContent(content, SpaceTypeEnum.DANCE) ||
      isValidReservationContent(content, SpaceTypeEnum.GROUP) ||
      isValidReservationContent(content, SpaceTypeEnum.MIRAE) ||
      isValidReservationContent(content, SpaceTypeEnum.SUMI) ||
      isValidReservationContent(content, SpaceTypeEnum.WORK) ||
      isValidReservationContent(content, SpaceTypeEnum.OPEN);
  }
  return false;
}


// 예약 내용의 프로퍼티들의 타입 유효성 검사
export function isValidReservationContentProperty(
  content: any,
  property: string
): content is IReservationContent {
  if (typeof content !== "object" || !(property in content) ) return false;
  const value = content[property];
  switch (property) {
    // strings
    case 'eventName':
    case 'organizationName':
    case 'participantNumber':
    case 'contents':
    case 'eventPurpose':
    case 'food':
      return typeof value === 'string';

    // numbers
    case 'participantNumber':
    case 'innerParticipantNumber':
    case 'outerParticipantNumber':
    case 'desk':
    case 'chair':
      return typeof value === 'number';
    
    // booleans
    case 'lobby':
      return typeof value === 'boolean';
    case 'workComplete':
      return typeof value === 'boolean' || value === null;
    
    // arrays
    case 'teamMemberUserIds':
      return Array.isArray(value) && value.every(member => typeof member === 'number');
    case 'equipment':
      return Array.isArray(value) && value.every(item => item in ReservationHallEquipEnum);
    case 'character':
      return Array.isArray(value) && value.every(item => item in ReservationCharacterEnum);
    
    default:
      return false; // 알 수 없는 속성
  }
}