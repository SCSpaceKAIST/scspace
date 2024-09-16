"use client";

import {
  ReservationInputType,
  SpaceTimeCheckInputType,
  UserTimeCheckInputType,
} from "@depot/types/reservation";
import { sendGet, sendPost } from "./useApi";
import { SpaceType } from "@depot/types/space";
import { useLinkPush } from "./useLinkPush";

export const useReservationSend = () => {
  const { linkPush } = useLinkPush();
  const handleReservationSend = (
    reservationInput: ReservationInputType,
    space: SpaceType
  ) => {
    // 예약 시간대가 비었는지 확인하는 API 호출
    sendGet<boolean>("/reservation/timeCheck", {
      space_id: reservationInput.space_id,
      time_from: reservationInput.time_from,
      time_to: reservationInput.time_to,
    } as SpaceTimeCheckInputType).then((timeResponse) => {
      if (timeResponse) {
        // 그 사람의 예약 시간이 괜찮은지 확인하는 API 호출
        sendGet<boolean>("/reservation/userCheck", {
          space_id: reservationInput.space_id,
          time_from: reservationInput.time_from,
          time_to: reservationInput.time_to,
          user_id: reservationInput.user_id,
        } as UserTimeCheckInputType).then((userResponse) => {
          if (userResponse !== false) {
            sendPost<boolean>("/reservation", reservationInput).then(
              (postResponse) => {
                if (postResponse) {
                  alert("예약이 완료되었습니다.");
                  //linkPush(`/calendar/${reservationInput.space_id}`);
                } else {
                  alert("예약에 실패했습니다. 다시 시도해주세요.");
                }
              }
            );
          } else {
            alert(`${space.name}의 주간 최대 이용 시간을 초과하셨습니다.`);
          }
        });
      } else {
        alert("이미 예약된 시간대입니다.");
      }
    });
  };
  return { handleReservationSend };
};
