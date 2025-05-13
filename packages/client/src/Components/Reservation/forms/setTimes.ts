import {
  reservationMaxDate,
  reservationMaxDayTime,
  reservationMinDate,
} from "@scspace-depot/consts/reservation.const";
import { ISpace } from "@scspace-depot/types/space";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";

export const setTimes = (
  space: ISpace,
  isSCS: () => boolean
) => {
  const spaceType = space.spaceType;
  const calculateDate = (date: Date, day: number): Date => {
    return new Date(date.getTime() + (day + 1) * 24 * 60 * 60 * 1000 - 1);
  };
  // maxTime 설정 (하루 최대 예약 시간)
  const maxTime = isSCS()
    ? 60 * 24 * 7 * 365
    : reservationMaxDayTime[spaceType];

  const setTimeToMidnight = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
    return newDate;
  };
  const currentDate = setTimeToMidnight(new Date()); // 현재 시간을 00:00:00으로 맞춤

  // minDate와 maxDate 설정
  const minDate = new Date(
    isSCS()
      ? currentDate.getTime()
      : currentDate.getTime() +
        reservationMinDate[spaceType] * 24 * 60 * 60 * 1000
  ); // 최소 예약 가능 날짜
  const maxDate = new Date(
    isSCS()
      ? currentDate.getTime() + (365 + 1) * 24 * 60 * 60 * 1000 - 1
      : currentDate.getTime() +
        (reservationMaxDate[spaceType] + 1) * 24 * 60 * 60 * 1000 -
        1
  ); // 최대 예약 가능 날짜

  return { maxTime, minDate, maxDate };
};
