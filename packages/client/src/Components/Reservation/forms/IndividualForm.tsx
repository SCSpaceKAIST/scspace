"use client";

// components/ReservationForm.tsx
import React, { useState } from "react";
import DateTimeInput from "../inputs/DateTimeInput";
import {
  ReservationInputType,
  ReservationStateEnum,
} from "@depot/types/reservation";
import AgreeCheck from "../inputs/AgreeCheck";
import HelpTooltip from "@/Components/_commons/HelpTooltip";
import TextInput from "../inputs/TextInput";
import MultipleCheckboxInput from "../inputs/MultipleCheckboxInput";
import MultipleRadioInput from "../inputs/MultipleRadioInput";
import { SpaceType } from "@depot/types/space";
import { sendGet, sendPost } from "@/Hooks/useApi";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { useReservationSend } from "@/Hooks/useReservationSend";

const stateOptions: { [key in ReservationStateEnum]: string } = {
  grant: "승인",
  wait: "대기",
  rejected: "거절",
  received: "접수",
};

interface ReservationFormProps {
  space_id: number;
  space: SpaceType;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  space_id,
  space,
}) => {
  const [timeFrom, setTimeFrom] = useState<Date>(new Date());
  const [timeTo, setTimeTo] = useState<Date>(new Date());
  const [agreeCheck, setAgreeCheck] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("");
  const { userInfo } = useLoginCheck();
  const { handleReservationSend } = useReservationSend();
  const handleSubmit = () => {
    if (!userInfo) return; // 로그인 안한 경우, 나올 일은 없으나 컴파일 에러 방지
    if (!agreeCheck) {
      alert("약관에 동의해주세요.");
      return;
    }
    const reservationInput: ReservationInputType = {
      space_id,
      time_from: timeFrom,
      time_to: timeTo,
      user_id: userInfo?.user_id,
      content: { eventName },
      state: "grant",
      worker_need: "unnecessary",
    };

    handleReservationSend(reservationInput, space);
  };

  return (
    <div>
      <h3>개인연습실 예약 폼</h3>
      <HelpTooltip
        message="하루에 최대 4시간, 1~14일 전에 예약 가능합니다."
        placement="bottom"
        text="도움말"
      />
      <hr />
      <DateTimeInput
        dateFrom={timeFrom}
        setDateFrom={setTimeFrom}
        dateTo={timeTo}
        setDateTo={setTimeTo}
        maxTime={120}
        minDate={new Date()}
        maxDate={new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)}
      />
      <TextInput label="이벤트명" text={eventName} setText={setEventName} />
      <AgreeCheck checked={agreeCheck} setChecked={setAgreeCheck} />

      <button className="modalButton2" onClick={handleSubmit}>
        예약하기
      </button>
    </div>
  );
};

export default ReservationForm;
