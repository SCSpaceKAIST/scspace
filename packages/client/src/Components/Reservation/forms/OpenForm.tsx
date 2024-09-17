"use client";

// components/ReservationForm.tsx
import React, { useState } from "react";
import DateTimeInput from "../inputs/DateTimeInput";
import {
  OpenContentType,
  ReservationInputType,
  SeminarContentType,
} from "@depot/types/reservation";
import AgreeCheck from "../inputs/AgreeCheck";
import TextInput from "../inputs/TextInput";
import { SpaceType } from "@depot/types/space";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { useReservationSend } from "@/Hooks/useReservationSend";

import TimeTooltips from "../utils/TimeTooltips";
import { validateReservationInput } from "./validateReservationInput";
import { setTimes } from "./setTimes";
import NumberInput from "../inputs/NumberInput";

interface ReservationFormProps {
  space_id: number;
  space: SpaceType;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  space_id,
  space,
}) => {
  const { maxTime, minDate, maxDate } = setTimes(space);
  const [timeFrom, setTimeFrom] = useState<Date>(minDate);
  const [timeTo, setTimeTo] = useState<Date>(minDate);
  const [agreeCheck, setAgreeCheck] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [contents, setContents] = useState<string>("");
  const [innerNumber, setInnerNumber] = useState<number | undefined>(1);
  const [outerNumber, setOuterNumber] = useState<number | undefined>(1);
  const [eventPurpose, setEventPurpose] = useState<string>("");
  const { userInfo } = useLoginCheck();
  const { handleReservationSend } = useReservationSend();
  const handleSubmit = () => {
    if (!userInfo) return; // 로그인 안한 경우, 나올 일은 없으나 컴파일 에러 방지
    if (!innerNumber || !outerNumber) {
      alert("인원 수를 확인해주세요.");
      return;
    }
    const reservationInput: ReservationInputType = {
      space_id,
      time_from: timeFrom.toISOString(),
      time_to: timeTo.toISOString(),
      user_id: userInfo?.user_id,
      content: {
        eventName,
        organizationName,
        contents,
        innerNumber,
        outerNumber,
        eventPurpose,
        workComplete: null,
      } as OpenContentType,

      state: "grant",
      worker_need: "unnecessary",
    };
    const inputVal = validateReservationInput(
      reservationInput,
      space.space_type,
      agreeCheck
    );
    if (!inputVal.valid) {
      alert(inputVal.errors);
      return;
    }
    handleReservationSend(reservationInput, space);
  };

  return (
    <div>
      <h3>오픈 스페이스 예약 폼</h3>
      <TimeTooltips spaceType={space.space_type} />
      <hr />
      <DateTimeInput
        dateFrom={timeFrom}
        setDateFrom={setTimeFrom}
        dateTo={timeTo}
        setDateTo={setTimeTo}
        maxTime={maxTime}
        minDate={minDate}
        maxDate={maxDate}
        ignoreMidnight={true}
      />
      <TextInput label="이벤트명" text={eventName} setText={setEventName} />
      <TextInput
        label="단체명"
        text={organizationName}
        setText={setOrganizationName}
      />
      <TextInput label="행사 내용" text={contents} setText={setContents} />
      <NumberInput
        label="내부 인원"
        num={innerNumber}
        setNum={setInnerNumber}
      />
      <NumberInput
        label="외부 인원"
        num={outerNumber}
        setNum={setOuterNumber}
      />
      <TextInput
        label="행사 목적"
        text={eventPurpose}
        setText={setEventPurpose}
      />

      <AgreeCheck checked={agreeCheck} setChecked={setAgreeCheck} />
      <button className="modalButton2" onClick={handleSubmit}>
        예약하기
      </button>
    </div>
  );
};

export default ReservationForm;
