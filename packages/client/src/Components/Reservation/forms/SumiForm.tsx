"use client";

// components/ReservationForm.tsx
import React, { useState } from "react";
import DateTimeInput from "../inputs/DateTimeInput";
import {
  IReservationCreate,
  ISumiContent,
  hallEquipsOptions,
  isValidWorkerNeed,
  reservationCharacterOptions,
  workerNeedOptions,
} from "@depot/types/reservation";
import AgreeCheck from "../inputs/AgreeCheck";
import TextInput from "../inputs/TextInput";
import { ISpace } from "@depot/types/space";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { useReservationSend } from "@/Hooks/useReservationSend";

import TimeTooltips from "../utils/TimeTooltips";
import { validateReservationInput } from "./validateReservationInput";
import { setTimes } from "./setTimes";
import NumberInput from "../inputs/NumberInput";
import MultipleCheckboxInput from "../inputs/MultipleCheckboxInput";
import MultipleRadioInput from "../inputs/MultipleRadioInput";
import CheckboxInput from "../inputs/CheckboxInput";
import { ReservationCharacterEnum, ReservationHallEquipEnum, ReservationStateEnum } from "@depot/enums/reservation.enum";
import { ReservationWorkerNeedEnum } from "@depot/enums/reservation.enum";
import { enumToArray } from "@depot/utils";

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
  const [contents, setContents] = useState<string>("");
  const [equipment, setEquipment] = useState<ReservationHallEquipEnum[]>([]);
  const [innerParticipantNumber, setInnerParticipantNumber] = useState<number | undefined>(0);
  const [outerParticipantNumber, setOuterParticipantNumber] = useState<number | undefined>(0);
  const [eventPurpose, setEventPurpose] = useState<string>("");
  const [food, setFood] = useState<string>("");
  const [desk, setDesk] = useState<number | undefined>(0);
  const [chair, setChair] = useState<number | undefined>(0);
  const [lobby, setLobby] = useState<boolean>(false);
  const [workerNeed, setWorkerNeed] = useState<ReservationWorkerNeedEnum>(ReservationWorkerNeedEnum.UNNECESSARY);
  const [character, setCharacter] = useState<ReservationCharacterEnum[]>([]);
  const handleSubmit = () => {
    if (!userInfo) return; // 로그인 안한 경우, 나올 일은 없으나 컴파일 에러 방지
    if (!isValidWorkerNeed(workerNeed)) return; // workerNeed가 유효하지 않은 경우
    if (!innerParticipantNumber) {
      alert("인원 수를 확인해주세요.");
      return;
    }

    const reservationInput: IReservationCreate = {
      spaceId,
      timeFrom: timeFrom,
      timeTo: timeTo,
      userId: userInfo?.id,
      content: {
        eventName,
        organizationName,
        contents,
        equipment,
        innerParticipantNumber: innerParticipantNumber,
        outerParticipantNumber: outerParticipantNumber,
        eventPurpose,
        food,
        desk,
        chair,
        lobby,
        character,
      } as ISumiContent,
      state: ReservationStateEnum.WAIT,
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
      <h3>조수미홀 예약 폼</h3>
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
      <TextInput label="행사 내용" text={contents} setText={setContents} />
      <MultipleCheckboxInput
        contents={enumToArray(ReservationHallEquipEnum)}
        labels={enumToArray(hallEquipsOptions)}
        header="사용 장비 선택"
        selected={equipment}
        setSelected={setEquipment}
      />
      <NumberInput
        label="참여 교내 구성원"
        num={innerParticipantNumber}
        setNum={setInnerParticipantNumber}
      />
      <NumberInput
        label="참여 교외인원"
        num={outerParticipantNumber}
        setNum={setOuterParticipantNumber}
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
        contents={enumToArray(ReservationCharacterEnum)}
        labels={enumToArray(reservationCharacterOptions)}
        header="행사 목적성 해당 시 선택"
        selected={character}
        setSelected={setCharacter}
      />
      <MultipleRadioInput
        contents={enumToArray(ReservationWorkerNeedEnum)}
        labels={enumToArray(workerNeedOptions)}
        header="근로 필요 여부"
        selected={workerNeed}
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
