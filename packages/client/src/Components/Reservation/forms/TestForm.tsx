"use client";

// components/ReservationForm.tsx
import React, { use, useState } from "react";
import DateTimeInput from "../inputs/DateTimeInput";
import { reservationStateOptions } from "@scspace-depot/types/reservation";
import AgreeCheck from "../inputs/AgreeCheck";
import HelpTooltip from "@scspace-client/Components/_commons/HelpTooltip";
import TextInput from "../inputs/TextInput";
import MultipleCheckboxInput from "../inputs/MultipleCheckboxInput";
import MultipleRadioInput from "../inputs/MultipleRadioInput";
import { ISpace } from "@scspace-depot/types/space";
import CheckboxInput from "../inputs/CheckboxInput";
import { useReservationSend } from "@scspace-client/Hooks/useReservationSend";
import { AskStateEnum } from "@scspace-depot/enums/ask.enum";

interface ReservationFormProps {
  spaceId: number;
  space: ISpace;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  spaceId,
  space,
}) => {
  const [timeFrom, setTimeFrom] = useState<Date>(new Date());
  const [timeTo, setTimeTo] = useState<Date>(new Date());
  const [agreeCheck, setAgreeCheck] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("");
  const [contents, setContents] = useState<AskStateEnum[]>([AskStateEnum.WAIT, AskStateEnum.RECEIVE]);
  const [selected1, setSelected1] = useState<AskStateEnum[]>([]);
  const [selected2, setSelected2] = useState<AskStateEnum | null>(null);
  const [labels, setLabels] = useState<string[]>(["l1", "l2", "l3"]);

  const handleSubmit = () => {
    alert(
      JSON.stringify({
        timeFrom,
        timeTo,
        agreeCheck,
        eventName,
        selected1,
        selected2,
      })
    );
    if (!agreeCheck) {
      alert("약관에 동의해주세요.");
      return;
    }
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
      <CheckboxInput
        label="약관 동의"
        checked={agreeCheck}
        setChecked={setAgreeCheck}
      />
      <AgreeCheck checked={agreeCheck} setChecked={setAgreeCheck} />
      <MultipleCheckboxInput
        contents={contents}
        labels={labels}
        header="멀첵1"
        selected={selected1}
        setSelected={setSelected1}
      />
      <MultipleRadioInput
        contents={contents}
        labels={labels}
        header="멀첵2"
        selected={selected2}
        setSelected={setSelected2}
      />

      <button className="modalButton2" onClick={handleSubmit}>
        예약하기
      </button>
    </div>
  );
};

export default ReservationForm;
