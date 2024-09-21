"use client";

import {
  ReservationInputType,
  SpaceTimeCheckInputType,
  UserTimeCheckInputType,
} from "@depot/types/reservation";
import { sendGet, sendPost } from "./useApi";
import { SpaceType } from "@depot/types/space";
import { useLinkPush } from "./useLinkPush";
import { UserTypeEnum } from "@depot/types/user";

export const useReservationSend = () => {
  const { linkPush } = useLinkPush();
  const handleReservationSend = async (
    reservationInput: ReservationInputType,
    space: SpaceType,
    ckUsertype: (type: UserTypeEnum | null | undefined) => boolean
  ) => {
    try {
      // 예약 시간대가 비었는지 확인하는 API 호출
      const timeResponse = await sendGet<boolean>("/reservation/timeCheck", {
        space_id: reservationInput.space_id,
        time_from: reservationInput.time_from,
        time_to: reservationInput.time_to,
      } as SpaceTimeCheckInputType);

      if (!timeResponse) {
        alert("이미 예약된 시간대입니다.");
        return;
      }
      if (!ckUsertype("admin")) {
        // 관리자가 아닌 경우
        // 그 사람의 예약 시간이 괜찮은지 확인하는 API 호출
        const userResponse = await sendGet<boolean>("/reservation/userCheck", {
          space_id: reservationInput.space_id,
          time_from: reservationInput.time_from,
          time_to: reservationInput.time_to,
          user_id: reservationInput.user_id,
        } as UserTimeCheckInputType);

        if (!userResponse) {
          alert(`${space.name}의 최대 이용 시간을 초과하셨습니다.`);
          return;
        }
      }
      // 예약 요청 API 호출
      const postResponse = await sendPost<boolean>(
        "/reservation",
        reservationInput
      );

      if (postResponse) {
        alert("예약이 완료되었습니다.");
        linkPush(`/calendar/${reservationInput.space_id}`);
      } else {
        alert("예약에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("예약 처리 중 오류가 발생했습니다:", error);
      alert("예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return { handleReservationSend };
};
