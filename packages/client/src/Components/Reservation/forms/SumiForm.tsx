"use client";

// components/ReservationForm.tsx
import React, { useState } from "react";
import DateTimeInput from "../inputs/DateTimeInput";
import {
  ReservationInputType,
  SumiContentType,
  hallEquipsOptions,
  isValidWorkerNeed,
  reservationCharacterOptions,
  workerNeedInputOptions,
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
import MultipleCheckboxInput from "../inputs/MultipleCheckboxInput";
import MultipleRadioInput from "../inputs/MultipleRadioInput";
import CheckboxInput from "../inputs/CheckboxInput";

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
  const [equipment, setEquipment] = useState<string[]>([]);
  const [innerNumber, setInnerNumber] = useState<number | undefined>(0);
  const [outerNumber, setOuterNumber] = useState<number | undefined>(0);
  const [eventPurpose, setEventPurpose] = useState<string>("");
  const [food, setFood] = useState<string>("");
  const [desk, setDesk] = useState<number | undefined>(0);
  const [chair, setChair] = useState<number | undefined>(0);
  const [lobby, setLobby] = useState<boolean>(false);
  const [worker_need, setWorkerNeed] = useState<string>("unnecessary");
  const [character, setCharacter] = useState<string[]>([]);
  const { userInfo } = useLoginCheck();
  const { handleReservationSend } = useReservationSend();
  const handleSubmit = () => {
    if (!userInfo) return; // 로그인 안한 경우, 나올 일은 없으나 컴파일 에러 방지
    if (!isValidWorkerNeed(worker_need)) return; // worker_need가 유효하지 않은 경우
    if (!innerNumber) {
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
        equipment,
        innerNumber: innerNumber,
        outerNumber: outerNumber,
        eventPurpose,
        food,
        desk,
        chair,
        lobby,
      } as SumiContentType,
      state: "wait",
      worker_need,
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
      <h3>조수미홀 예약 폼</h3>
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
      />
      <TextInput label="이벤트명" text={eventName} setText={setEventName} />
      <TextInput
        label="단체명"
        text={organizationName}
        setText={setOrganizationName}
      />
      <TextInput label="행사 내용" text={contents} setText={setContents} />
      <MultipleCheckboxInput
        contents={Object.keys(hallEquipsOptions)}
        labels={Object.values(hallEquipsOptions)}
        header="사용 장비 선택"
        selected={equipment}
        setSelected={setEquipment}
      />
      <NumberInput
        label="참여 교내 구성원"
        num={innerNumber}
        setNum={setInnerNumber}
      />
      <NumberInput
        label="참여 교외인원"
        num={outerNumber}
        setNum={setOuterNumber}
      />
      <TextInput
        label="행사 목적"
        text={eventPurpose}
        setText={setEventPurpose}
      />
      <TextInput
        label="내부 음식물 섭취 필요시 설명"
        text={food}
        setText={setFood}
      />
      <NumberInput label="테이블 수" num={desk} setNum={setDesk} />
      <NumberInput label="의자 수" num={chair} setNum={setChair} />
      <CheckboxInput
        label="로비 사용 여부"
        checked={lobby}
        setChecked={setLobby}
      />
      <MultipleCheckboxInput
        contents={Object.keys(reservationCharacterOptions)}
        labels={Object.values(reservationCharacterOptions)}
        header="행사 목적성 해당 시 선택"
        selected={character}
        setSelected={setCharacter}
      />
      <MultipleRadioInput
        contents={Object.keys(workerNeedInputOptions)}
        labels={Object.values(workerNeedInputOptions)}
        header="근로 필요 여부"
        selected={worker_need}
        setSelected={setWorkerNeed}
      />
      <AgreeCheck checked={agreeCheck} setChecked={setAgreeCheck} />
      <button className="modalButton2" onClick={handleSubmit}>
        예약하기
      </button>
    </div>
  );
};

export default ReservationForm;
