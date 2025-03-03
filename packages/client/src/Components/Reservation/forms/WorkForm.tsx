"use client";

// components/ReservationForm.tsx
import React, { useState } from "react";
import DateTimeInput from "../inputs/DateTimeInput";
import {
  IReservation,
  IReservationCreate,
  IWorkContent,
} from "@depot/types/reservation";
import AgreeCheck from "../inputs/AgreeCheck";
import TextInput from "../inputs/TextInput";
import { ISpace } from "@depot/types/space";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { useReservationSend } from "@/Hooks/useReservationSend";
import { ReservationStateEnum, ReservationWorkerNeedEnum } from "@depot/enums/reservation.enum";
import TimeTooltips from "../utils/TimeTooltips";
import { validateReservationInput } from "./validateReservationInput";
import { setTimes } from "./setTimes";

interface ReservationFormProps {
  spaceId: number;
  space: ISpace;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  spaceId,
  space,
}) => {
  const { userInfo, isSCS } = useLoginCheck();
  const { handleReservationSend } = useReservationSend();
  const { maxTime, minDate, maxDate } = setTimes(space, isSCS);
  const [timeFrom, setTimeFrom] = useState<Date>(minDate);
  const [timeTo, setTimeTo] = useState<Date>(minDate);
  const [agreeCheck, setAgreeCheck] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const handleSubmit = () => {
    if (!userInfo) return; // 로그인 안한 경우, 나올 일은 없으나 컴파일 에러 방지
    const reservationInput: IReservationCreate = {
      spaceId,
      timeFrom: timeFrom,
      timeTo: timeTo,
      userId: userInfo?.id,
      content: {
        eventName,
        organizationName,
      } as IWorkContent,
      state: ReservationStateEnum.GRANT,
      workerNeed: ReservationWorkerNeedEnum.UNNECESSARY,
    };
    const inputVal = validateReservationInput(
      reservationInput,
      space.spaceType,
      agreeCheck
    );
    if (!inputVal.valid) {
      alert(inputVal.errors);
      return;
    }
    handleReservationSend(reservationInput, space, isSCS);
  };

  return (
    <div>
      <h3>창작공방 예약 폼</h3>
      <TimeTooltips spaceType={space.spaceType} />
      <hr />
      <DateTimeInput
        dateFrom={timeFrom}
        setDateFrom={setTimeFrom}
        dateTo={timeTo}
        setDateTo={setTimeTo}
        maxTime={maxTime}
        minDate={minDate}
        maxDate={maxDate}
        ignoreMidnight={isSCS()}
      />
      <TextInput label="이벤트명" text={eventName} setText={setEventName} />
      <TextInput
        label="단체명"
        text={organizationName}
        setText={setOrganizationName}
      />
      <AgreeCheck checked={agreeCheck} setChecked={setAgreeCheck} />
      <button className="modalButton2" onClick={handleSubmit}>
        예약하기
      </button>
    </div>
  );
};

export default ReservationForm;
