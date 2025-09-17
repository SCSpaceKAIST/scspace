import { SpaceTypeEnum } from "../enums/space.enum";

export const reservationMaxDayTime: { [key in SpaceTypeEnum]: number } = {
  [SpaceTypeEnum.INDIVIDUAL]: 120, // 개인연습실, 하루 최대 2시간
  [SpaceTypeEnum.PIANO]: 120, // 피아노실, 하루 최대 2시간
  [SpaceTypeEnum.SEMINAR]: 180, // 세미나실 1주일 최대 6시간 (세미나1실/세미나2실 합계), 하루 최대 3시간으로 계산
  [SpaceTypeEnum.DANCE]: 120, // 무예실, 하루 최대 2시간
  [SpaceTypeEnum.GROUP]: 120, // 합주실, 하루 최대 2시간
  [SpaceTypeEnum.MIRAE]: 240, // 미래홀, 하루 최대 4시간
  [SpaceTypeEnum.SUMI]: 240, // 조수미홀, 하루 최대 4시간
  [SpaceTypeEnum.OPEN]: 240, // 오픈스페이스, 하루 최대 4시간
  [SpaceTypeEnum.WORK]: 240, // 창작공방, 하루 최대 4시간
};

export const reservationMaxWeekTime: { [key in SpaceTypeEnum]: number } = {
  [SpaceTypeEnum.INDIVIDUAL]: 120 * 7, // 개인연습실, 일주일 최대 14시간
  [SpaceTypeEnum.PIANO]: 120 * 7, // 피아노실, 일주일 최대 14시간
  [SpaceTypeEnum.SEMINAR]: 180 * 2, // 세미나실 1주일 최대 6시간 (세미나1실/세미나2실 합계)
  [SpaceTypeEnum.DANCE]: 60 * 5, // 무예실, 일주일 최대 5시간
  [SpaceTypeEnum.GROUP]: 60 * 5, // 합주실, 일주일 최대 5시간
  [SpaceTypeEnum.MIRAE]: 240 * 2, // 미래홀, 최대 8시간
  [SpaceTypeEnum.SUMI]: 240 * 2, // 조수미홀, 최대 8시간
  [SpaceTypeEnum.OPEN]: 240 * 7, // 오픈스페이스, 최대 28시간
  [SpaceTypeEnum.WORK]: 240 * 7, // 창작공방, 최대 28시간
};

export const reservationTimeWeightOrg: { [key in SpaceTypeEnum]: number } = {
  [SpaceTypeEnum.INDIVIDUAL]: 1, // 개인과 동일
  [SpaceTypeEnum.PIANO]: 1, // 개인과 동일
  [SpaceTypeEnum.SEMINAR]: 1, // 개인과 동일
  [SpaceTypeEnum.DANCE]: 2, // 개인의 2배 (4시간, 10시간)
  [SpaceTypeEnum.GROUP]: 2, // 개인의 2배 (4시간, 10시간)
  [SpaceTypeEnum.MIRAE]: 6, // 개인의 6배 (24시간)
  [SpaceTypeEnum.SUMI]: 6, // 개인의 6배 (24시간)
  [SpaceTypeEnum.OPEN]: 6, // 개인의 6배 (24시간)
  [SpaceTypeEnum.WORK]: 2, // 개인의 2배 (8시간)
}

export const reservationMinDate: { [key in SpaceTypeEnum]: number } = {
  [SpaceTypeEnum.INDIVIDUAL]: 1, // 개인연습실, 1일 전부터 예약 가능
  [SpaceTypeEnum.PIANO]: 1, // 피아노실, 1일 전부터 예약 가능
  [SpaceTypeEnum.SEMINAR]: 2, // 세미나실, 2일 전부터 예약 가능
  [SpaceTypeEnum.DANCE]: 2, // 무예실, 2일 전부터 예약 가능
  [SpaceTypeEnum.GROUP]: 2, // 다용도실, 2일 전부터 예약 가능
  [SpaceTypeEnum.MIRAE]: 10, // 미래홀, 10일 전까지 예약 필수
  [SpaceTypeEnum.SUMI]: 10, // 조수미홀, 10일 전까지 예약 필수
  [SpaceTypeEnum.OPEN]: 5, // 오픈스페이스, 5일 전까지 예약 필수
  [SpaceTypeEnum.WORK]: 1, // 창작공방, 1일 전부터 예약 가능
};

export const reservationMaxDate: { [key in SpaceTypeEnum]: number } = {
  [SpaceTypeEnum.INDIVIDUAL]: 14, // 개인연습실, 사용일 14일 전부터 예약 가능
  [SpaceTypeEnum.PIANO]: 14, // 피아노실, 사용일 14일 전부터 예약 가능
  [SpaceTypeEnum.SEMINAR]: 14, // 세미나실, 사용일 14일 전부터 예약 가능
  [SpaceTypeEnum.DANCE]: 14, // 무예실, 사용일 14일 전부터 예약 가능
  [SpaceTypeEnum.GROUP]: 14, // 합주실, 사용일 14일 전부터 예약 가능
  [SpaceTypeEnum.MIRAE]: 45, // 미래홀, 전체 학내 구성원은 45일 전부터 예약 가능
  [SpaceTypeEnum.SUMI]: 45, // 조수미홀, 전체 학내 구성원은 45일 전부터 예약 가능
  [SpaceTypeEnum.OPEN]: 45, // 오픈스페이스, 사용일 45일 전부터 예약 가능
  [SpaceTypeEnum.WORK]: 14, // 창작공방, 사용일 14일 전부터 예약 가능
};