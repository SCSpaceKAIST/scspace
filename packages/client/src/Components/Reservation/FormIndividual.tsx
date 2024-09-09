import React, { useState, ChangeEvent, FormEvent, useCallback } from "react";
import { useRouter } from "next/router";
import Time from "./inputs/TimeSelector";
import Agree from "./inputs/Agree";
import SpacePick from "./inputs/SpacePick";
import Recurrence from "./inputs/RecurrenceCheck";
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from "react-i18next";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { sendPost } from "@/Hooks/useApi";
import { useLinkPush } from "@/Hooks/useLinkPush";

// Define the types for props and state
interface FormProps extends WithTranslation {}

interface FormState {
  space: string;
  timeFrom: string;
  timeTo: string;
  content: { [key: string]: any };
  recurrence: {
    isRecurrence: boolean;
    interval: number;
    byday: number[];
    until: Date | null;
  };
}

const Form: React.FC<FormProps> = () => {
  const [reservationInput, setReservationInput] = useState<FormState>({
    space: "individual-practice-room1",
    timeFrom: "",
    timeTo: "",
    content: { eventName: null },
    recurrence: {
      isRecurrence: false,
      interval: 1,
      byday: [2],
      until: null,
    },
  });

  const { t } = useTranslation();
  const { userInfo } = useLoginCheck();
  const { linkPush } = useLinkPush();
  const limitdate = { mindays: 1, maxdays: 14, maxUseHour: 2 };

  const checkSubmit = (): string | true => {
    if (
      new Date(state.timeFrom).getTime() >= new Date(state.timeTo).getTime()
    ) {
      return "시작 시간과 종료 시간을 올바르게 선택해주세요";
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = checkSubmit();
    if (error === true) {
      try {
        const response = await sendPost<number | boolean>(
          "/api/reservation",
          state
        );
        if (response !== false) {
          alert("예약이 완료되었습니다.");
        } else if (response === false) {
          alert("해당 시간에 이미 예약이 존재합니다.");
        }
      } catch (error) {
        console.error("Failed to submit form:", error);
      }
    } else {
      alert(error);
    }
  };

  const handleValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setState((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleValueChangeTime = useCallback(
    (what: keyof FormState, date: string) => {
      setState((prevState) => ({
        ...prevState,
        [what]: date,
      }));
    },
    []
  );

  const handleValueChangeContent = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => ({
        ...prevState,
        content: {
          ...prevState.content,
          [e.target.name]: e.target.value,
        },
      }));
    },
    []
  );

  const handleValueChangeRecur = (key: string, cont: any) => {
    setState((prevState) => {
      const updatedRecurrence = { ...prevState.recurrence };

      if (key === "TOGGLE") {
        updatedRecurrence.isRecurrence = !updatedRecurrence.isRecurrence;
      }
      if (key === "INTERVAL") {
        updatedRecurrence.interval = cont;
      }
      if (key === "BYDAY") {
        updatedRecurrence.byday = cont;
      }
      if (key === "UNTIL") {
        updatedRecurrence.until = cont;
      }

      return { ...prevState, recurrence: updatedRecurrence };
    });
  };

  const handleValueChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => {
      const updatedContent = { ...prevState.content };
      const name = e.target.name;
      const value = e.target.value;

      updatedContent[name] = updatedContent[name].includes(value)
        ? updatedContent[name].filter((item: string) => item !== value)
        : [...updatedContent[name], value];

      return { ...prevState, content: updatedContent };
    });
  };

  return (
    <div className="col-lg-8">
      <form className="php-email-form" onSubmit={handleSubmit}>
        <SpacePick
          spacelist={{
            "개인연습실 1": "individual-practice-room1",
            "개인연습실 2": "individual-practice-room2",
            "개인연습실 3": "individual-practice-room3",
          }}
          onChangeHandler={handleValueChange}
        />

        {userInfo?.type === "admin" ? (
          <Recurrence onChangeHandler={handleValueChangeRecur} />
        ) : (
          <div />
        )}
        <Agree />
        <div className="text-end">
          <button type="submit">{t("예약하기")}</button>
        </div>
      </form>
    </div>
  );
};

export default withTranslation()(Form);
