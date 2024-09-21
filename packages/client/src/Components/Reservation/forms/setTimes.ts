import {
  reservationMaxDate,
  reservationMaxDayTime,
  reservationMinDate,
} from "@depot/types/reservation";
import { SpaceType } from "@depot/types/space";
import { UserTypeEnum } from "@depot/types/user";

export const setTimes = (
  space: SpaceType,
  ckUsertype: (type: UserTypeEnum | null | undefined) => boolean
) => {
  const spaceType = space.space_type;
  const calculateDate = (date: Date, day: number): Date => {
    return new Date(date.getTime() + (day + 1) * 24 * 60 * 60 * 1000 - 1);
  };
  // maxTime 설정 (하루 최대 예약 시간)
  const maxTime = ckUsertype("admin")
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
    ckUsertype("admin")
      ? currentDate.getTime()
      : currentDate.getTime() +
        reservationMinDate[spaceType] * 24 * 60 * 60 * 1000
  ); // 최소 예약 가능 날짜
  const maxDate = new Date(
    ckUsertype("admin")
      ? currentDate.getTime() + (365 + 1) * 24 * 60 * 60 * 1000 - 1
      : currentDate.getTime() +
        (reservationMaxDate[spaceType] + 1) * 24 * 60 * 60 * 1000 -
        1
  ); // 최대 예약 가능 날짜

  return { maxTime, minDate, maxDate };
};
