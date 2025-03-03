import {

  IReservationContent,
  IIndividualContent,
  IPianoContent,
  ISeminarContent,
  IDanceContent,
  IGroupContent,
  IMiraeContent,
  ISumiContent,
  IWorkContent,
  IOpenContent,
  IReservationCreate,
} from "@depot/types/reservation";

import { SpaceTypeEnum } from "@depot/enums/space.enum";

// 개별 content 검증 함수
const validateIndividualContent = (content: IIndividualContent) => {
  if (content.eventName === null || typeof content.eventName === "string") {
    return true;
  }
  return false;
};

const validatePianoContent = (content: IPianoContent) => {
  if (content.eventName === null || typeof content.eventName === "string") {
    return true;
  }
  return false;
};

const validateSeminarContent = (content: ISeminarContent) => {
  const { participantNumber, contents, eventName, organizationName } = content;
  if (
    typeof participantNumber === "number" &&
    typeof contents === "string" &&
    typeof eventName === "string" &&
    typeof organizationName === "string"
  ) {
    return true;
  }
  return false;
};

const validateDanceContent = (content: IDanceContent) => {
  const { contents, eventName, teamMemberUserIds } = content;
  if (
    typeof contents === "string" &&
    typeof eventName === "string" &&
    Array.isArray(teamMemberUserIds) &&
    teamMemberUserIds.every((m) => typeof m === "number")
  ) {
    return true;
  }
  return false;
};

const validateGroupContent = (content: IGroupContent) => {
  const { contents, eventName, teamMemberUserIds } = content;
  if (
    typeof contents === "string" &&
    typeof eventName === "string" &&
    Array.isArray(teamMemberUserIds) &&
    teamMemberUserIds.every((m) => typeof m === "number")
  ) {
    return true;
  }
  return false;
};

const validateMiraeContent = (content: IMiraeContent) => {
  const {
    food,
    contents,
    equipment,
    eventName,
    innerParticipantNumber,
    outerParticipantNumber,
    eventPurpose,
    organizationName,
  } = content;
  if (
    typeof food === "string" &&
    typeof contents === "string" &&
    Array.isArray(equipment) &&
    equipment.every((e) => typeof e === "string") &&
    typeof eventName === "string" &&
    typeof innerParticipantNumber === "number" &&
    typeof outerParticipantNumber === "number" &&
    typeof eventPurpose === "string" &&
    typeof organizationName === "string"
  ) {
    return true;
  }
  return false;
};

const validateSumiContent = (content: ISumiContent) => {
  const {
    desk,
    chair,
    food,
    lobby,
    contents,
    equipment,
    eventName,
    innerParticipantNumber,
    outerParticipantNumber,
    eventPurpose,
    organizationName,
  } = content;
  if (
    typeof desk === "number" &&
    typeof chair === "number" &&
    typeof food === "string" &&
    typeof lobby === "boolean" &&
    typeof contents === "string" &&
    Array.isArray(equipment) &&
    equipment.every((e) => typeof e === "string") &&
    typeof eventName === "string" &&
    typeof innerParticipantNumber === "number" &&
    typeof outerParticipantNumber === "number" &&
    typeof eventPurpose === "string" &&
    typeof organizationName === "string"
  ) {
    return true;
  }
  return false;
};

const validateWorkContent = (content: IWorkContent) => {
  const { eventName, organizationName } = content;
  if (typeof eventName === "string" && typeof organizationName === "string") {
    return true;
  }
  return false;
};

const validateOpenContent = (content: IOpenContent) => {
  const {
    contents,
    eventName,
    innerParticipantNumber,
    outerParticipantNumber,
    eventPurpose,
    workComplete,
    organizationName,
  } = content;
  if (
    (contents === undefined || typeof contents === "string") &&
    (eventName === undefined || typeof eventName === "string") &&
    (innerParticipantNumber === undefined || typeof innerParticipantNumber === "number") &&
    (outerParticipantNumber === undefined || typeof outerParticipantNumber === "number") &&
    (eventPurpose === undefined || typeof eventPurpose === "string") &&
    (workComplete === undefined ||
      workComplete === null ||
      typeof workComplete === "boolean") &&
    (organizationName === undefined || typeof organizationName === "string")
  ) {
    return true;
  }
  return false;
};

// content 검증 함수
const validateContent = (
  content: IReservationContent,
  spaceType: SpaceTypeEnum
): boolean => {
  switch (spaceType) {
    case SpaceTypeEnum.INDIVIDUAL:
      return validateIndividualContent(content as IIndividualContent);
    case SpaceTypeEnum.PIANO:
      return validatePianoContent(content as IPianoContent);
    case SpaceTypeEnum.SEMINAR:
      return validateSeminarContent(content as ISeminarContent);
    case SpaceTypeEnum.DANCE:
      return validateDanceContent(content as IDanceContent);
    case SpaceTypeEnum.GROUP:
      return validateGroupContent(content as IGroupContent);
    case SpaceTypeEnum.MIRAE:
      return validateMiraeContent(content as IMiraeContent);
    case SpaceTypeEnum.SUMI:
      return validateSumiContent(content as ISumiContent);
    case SpaceTypeEnum.WORK:
      return validateWorkContent(content as IWorkContent);
    case SpaceTypeEnum.OPEN:
      return validateOpenContent(content as IOpenContent);
    default:
      return false;
  }
};

// 전체 유효성 검사 함수
export const validateReservationInput = (
  reservationInput: IReservationCreate,
  spaceType: SpaceTypeEnum,
  agreed: boolean
): { valid: boolean; errors: string } => {
  const errors: string[] = [];

  // 기본 필드 검증 (userId, spaceId 등)
  if (typeof reservationInput.userId !== "string") {
    errors.push("userId는 8자 문자열이어야 합니다.");
  }

  if (
    typeof reservationInput.spaceId !== "number" ||
    isNaN(reservationInput.spaceId)
  ) {
    errors.push("spaceId는 숫자여야 합니다.");
  }

  const timeFrom = new Date(reservationInput.timeFrom);
  const timeTo = new Date(reservationInput.timeTo);

  if (isNaN(timeFrom.getTime())) {
    errors.push("timeFrom 값이 유효한 날짜 형식이 아닙니다.");
  }

  if (isNaN(timeTo.getTime())) {
    errors.push("time_to 값이 유효한 날짜 형식이 아닙니다.");
  }

  if (timeFrom.getTime() > timeTo.getTime()) {
    errors.push("timeFrom은 time_to보다 이전이어야 합니다.");
  }

  if (timeFrom.getTime() == timeTo.getTime()) {
    errors.push("에약 시간을 확인해주세요.");
  }

  // content 검증
  if (
    !reservationInput.content ||
    !validateContent(reservationInput.content, spaceType)
  ) {
    errors.push("content 값이 유효하지 않습니다.");
  }
  if (agreed == false) {
    errors.push("약관에 동의해주세요.");
  }

  return {
    valid: errors.length === 0,
    errors: errors.join("\n"),
  };
};
