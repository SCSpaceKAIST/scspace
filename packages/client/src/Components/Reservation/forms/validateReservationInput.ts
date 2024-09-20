import {
  ReservationInputType,
  ReservationContentTypeEnum,
  IndividualContentType,
  PianoContentType,
  SeminarContentType,
  DanceContentType,
  GroupContentType,
  MiraeContentType,
  SumiContentType,
  WorkContentType,
  OpenContentType,
} from "@depot/types/reservation";

// 개별 content 검증 함수
const validateIndividualContent = (content: IndividualContentType) => {
  if (content.eventName === null || typeof content.eventName === "string") {
    return true;
  }
  return false;
};

const validatePianoContent = (content: PianoContentType) => {
  if (content.eventName === null || typeof content.eventName === "string") {
    return true;
  }
  return false;
};

const validateSeminarContent = (content: SeminarContentType) => {
  const { number, contents, eventName, organizationName } = content;
  if (
    typeof number === "string" &&
    typeof contents === "string" &&
    typeof eventName === "string" &&
    typeof organizationName === "string"
  ) {
    return true;
  }
  return false;
};

const validateDanceContent = (content: DanceContentType) => {
  const { contents, eventName, teamMember } = content;
  if (
    typeof contents === "string" &&
    typeof eventName === "string" &&
    Array.isArray(teamMember) &&
    teamMember.every((m) => typeof m === "string")
  ) {
    return true;
  }
  return false;
};

const validateGroupContent = (content: GroupContentType) => {
  const { contents, eventName, teamMember } = content;
  if (
    typeof contents === "string" &&
    typeof eventName === "string" &&
    Array.isArray(teamMember) &&
    teamMember.every((m) => typeof m === "string")
  ) {
    return true;
  }
  return false;
};

const validateMiraeContent = (content: MiraeContentType) => {
  const {
    food,
    contents,
    equipment,
    eventName,
    innerNumber,
    outerNumber,
    eventPurpose,
    organizationName,
  } = content;
  if (
    typeof food === "string" &&
    typeof contents === "string" &&
    Array.isArray(equipment) &&
    equipment.every((e) => typeof e === "string") &&
    typeof eventName === "string" &&
    typeof innerNumber === "number" &&
    typeof outerNumber === "number" &&
    typeof eventPurpose === "string" &&
    typeof organizationName === "string"
  ) {
    return true;
  }
  return false;
};

const validateSumiContent = (content: SumiContentType) => {
  const {
    desk,
    chair,
    food,
    lobby,
    contents,
    equipment,
    eventName,
    innerNumber,
    outerNumber,
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
    typeof innerNumber === "number" &&
    typeof outerNumber === "number" &&
    typeof eventPurpose === "string" &&
    typeof organizationName === "string"
  ) {
    return true;
  }
  return false;
};

const validateWorkContent = (content: WorkContentType) => {
  const { eventName, organizationName } = content;
  if (typeof eventName === "string" && typeof organizationName === "string") {
    return true;
  }
  return false;
};

const validateOpenContent = (content: OpenContentType) => {
  const {
    contents,
    eventName,
    innerNumber,
    outerNumber,
    eventPurpose,
    workComplete,
    organizationName,
  } = content;
  if (
    (contents === undefined || typeof contents === "string") &&
    (eventName === undefined || typeof eventName === "string") &&
    (innerNumber === undefined || typeof innerNumber === "number") &&
    (outerNumber === undefined || typeof outerNumber === "number") &&
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
  content: ReservationContentTypeEnum,
  spaceType: string
): boolean => {
  switch (spaceType) {
    case "individual":
      return validateIndividualContent(content as IndividualContentType);
    case "piano":
      return validatePianoContent(content as PianoContentType);
    case "seminar":
      return validateSeminarContent(content as SeminarContentType);
    case "dance":
      return validateDanceContent(content as DanceContentType);
    case "group":
      return validateGroupContent(content as GroupContentType);
    case "mirae":
      return validateMiraeContent(content as MiraeContentType);
    case "sumi":
      return validateSumiContent(content as SumiContentType);
    case "work":
      return validateWorkContent(content as WorkContentType);
    case "open":
      return validateOpenContent(content as OpenContentType);
    default:
      return false;
  }
};

// 전체 유효성 검사 함수
export const validateReservationInput = (
  reservationInput: ReservationInputType,
  spaceType: string,
  agreed: boolean
): { valid: boolean; errors: string } => {
  const errors: string[] = [];

  // 기본 필드 검증 (user_id, space_id 등)
  if (typeof reservationInput.user_id !== "string") {
    errors.push("user_id는 8자 문자열이어야 합니다.");
  }

  if (
    typeof reservationInput.space_id !== "number" ||
    isNaN(reservationInput.space_id)
  ) {
    errors.push("space_id는 숫자여야 합니다.");
  }

  const timeFrom = new Date(reservationInput.time_from);
  const timeTo = new Date(reservationInput.time_to);

  if (isNaN(timeFrom.getTime())) {
    errors.push("time_from 값이 유효한 날짜 형식이 아닙니다.");
  }

  if (isNaN(timeTo.getTime())) {
    errors.push("time_to 값이 유효한 날짜 형식이 아닙니다.");
  }

  if (timeFrom.getTime() > timeTo.getTime()) {
    errors.push("time_from은 time_to보다 이전이어야 합니다.");
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
