import { SpaceTypeEnum } from "../space";

export const reservationMaxDayTime: { [key in SpaceTypeEnum]: number } = {
  individual: 120, // 개인연습실, 하루 최대 2시간
  piano: 120, // 피아노실, 하루 최대 2시간
  seminar: 180, // 세미나실 1주일 최대 6시간 (세미나1실/세미나2실 합계), 하루 최대 6시간으로 계산
  dance: 120, // 무예실, 하루 최대 2시간
  group: 120, // 합주실, 하루 최대 2시간
  mirae: 1440, // 미래홀, 제한 없음 (하루 24시간 가능)
  sumi: 1440, // 조수미홀, 제한 없음 (하루 24시간 가능)
  open: 1440, // 오픈스페이스, 최대 14일 동안 사용 가능
  work: 360, // 창작공방, 하루 최대 6시간
};

export const reservationMaxWeekTime: { [key in SpaceTypeEnum]: number } = {
  individual: 120 * 7, // 개인연습실, 일주일 최대 14시간
  piano: 120 * 7, // 피아노실, 일주일 최대 14시간
  seminar: 180 * 2, // 세미나실 1주일 최대 6시간 (세미나1실/세미나2실 합계)
  dance: 120 * 7, // 무예실, 하루 최대 2시간
  group: 120 * 7, // 합주실, 하루 최대 2시간
  mirae: 1440 * 2, // 미래홀, 제한 없음 (하루 24시간 가능)
  sumi: 1440 * 2, // 조수미홀, 제한 없음 (하루 24시간 가능)
  open: 1440 * 7, // 오픈스페이스, 최대 14일 동안 사용 가능
  work: 360 * 7, // 창작공방, 하루 최대 6시간
};

export const reservationMinDate: { [key in SpaceTypeEnum]: number } = {
  individual: 1, // 개인연습실, 1일 전부터 예약 가능
  piano: 1, // 피아노실, 1일 전부터 예약 가능
  seminar: 2, // 세미나실, 2일 전부터 예약 가능
  dance: 2, // 무예실, 2일 전부터 예약 가능
  group: 2, // 다용도실, 2일 전부터 예약 가능
  mirae: 10, // 미래홀, 10일 전까지 예약 필수
  sumi: 10, // 조수미홀, 10일 전까지 예약 필수
  open: 5, // 오픈스페이스, 5일 전까지 예약 필수
  work: 1, // 창작공방, 1일 전부터 예약 가능
};

export const reservationMaxDate: { [key in SpaceTypeEnum]: number } = {
  individual: 14, // 개인연습실, 사용일 14일 전부터 예약 가능
  piano: 14, // 피아노실, 사용일 14일 전부터 예약 가능
  seminar: 14, // 세미나실, 사용일 14일 전부터 예약 가능
  dance: 14, // 무예실, 사용일 14일 전부터 예약 가능
  group: 14, // 합주실, 사용일 14일 전부터 예약 가능
  mirae: 45, // 미래홀, 전체 학내 구성원은 45일 전부터 예약 가능
  sumi: 45, // 조수미홀, 전체 학내 구성원은 45일 전부터 예약 가능
  open: 45, // 오픈스페이스, 사용일 45일 전부터 예약 가능
  work: 14, // 창작공방, 사용일 14일 전부터 예약 가능
};
