"use client";

import {
  IReservationCreate,
  ISpaceTimeCheckRequest,
  IUserTimeCheckRequest,
} from "@scspace-depot/types/reservation";
import { useQueryApi, useMutationApi } from "../../useAPI";
import { ISpace } from "@scspace-depot/types/space";
import { useLinkPush } from "../../useLinkPush";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";
import { reservationMaxDayTime } from "@scspace-depot/consts/reservation.const";

export const useReservationSend = () => {
  const { linkPush } = useLinkPush();
  const timeCheckMutation = useMutationApi<boolean, ISpaceTimeCheckRequest>(
    "/reservation/timeCheck",
    "GET",
  );
  const userCheckMutation = useMutationApi<boolean, IUserTimeCheckRequest>(
    "/reservation/userCheck",
    "GET",
  );

  const reservationSendMutation = useMutationApi<boolean, IReservationCreate>(
    "/reservation",
    "POST",
  );

  const handleReservationSend = async (
    reservationInput: IReservationCreate,
    space: ISpace,
    isSCS: () => boolean,
  ) => {
    const timeCheck = await timeCheckMutation.mutateAsync(reservationInput);
    const userCheck =
      isSCS() || (await userCheckMutation.mutateAsync(reservationInput));

    if (!timeCheck) {
      alert("이미 예약된 시간대입니다.");
      return;
    }
    if (!userCheck) {
      alert(
        `${space.nameKr}의 최대 이용 시간을 초과하셨습니다.\n${space.nameKr}의 최대 이용 시간은 ${reservationMaxDayTime[space.spaceType]}분 입니다.`,
      );
      return;
    }
    // 예약 요청 API 호출
    const postResponse =
      await reservationSendMutation.mutateAsync(reservationInput);

    if (postResponse) {
      alert("예약이 완료되었습니다.");
      linkPush(`/calendar/${reservationInput.spaceId}`);
    } else {
      alert("예약에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return { handleReservationSend };
};