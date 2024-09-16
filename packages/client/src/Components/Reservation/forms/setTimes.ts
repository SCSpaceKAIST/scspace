import {
  reservationMaxDate,
  reservationMaxDayTime,
  reservationMinDate,
} from "@depot/types/reservation";
import { SpaceType } from "@depot/types/space";

export const setTimes = (space: SpaceType) => {
  const spaceType = space.space_type;

  // maxTime 설정 (하루 최대 예약 시간)
  const maxTime = reservationMaxDayTime[spaceType];

  const setTimeToMidnight = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
    return newDate;
  };
  const currentDate = setTimeToMidnight(new Date()); // 현재 시간을 00:00:00으로 맞춤

  // minDate와 maxDate 설정
  const minDate = new Date(
    currentDate.getTime() + reservationMinDate[spaceType] * 24 * 60 * 60 * 1000
  ); // 최소 예약 가능 날짜
  const maxDate = new Date(
    currentDate.getTime() +
      (reservationMaxDate[spaceType] + 1) * 24 * 60 * 60 * 1000 -
      1
  ); // 최대 예약 가능 날짜

  return { maxTime, minDate, maxDate };
};
