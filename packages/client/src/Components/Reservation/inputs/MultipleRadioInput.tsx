import { AskStateEnum } from "@depot/enums/ask.enum";
import { ReservationStateEnum } from "@depot/enums/reservation.enum";
import { ReservationWorkerNeedEnum } from "@depot/enums/reservation.enum";
import React, { useEffect } from "react";
import { InputAvailableEnum } from "./common/inputAvailableEnum";


interface RadioInputProps<T> {
  contents: T[]; // 라디오 버튼의 value 값
  labels: string[]; // 라벨로 표시될 텍스트
  header: string; // 상단 헤더 텍스트
  selected: T | null; // 선택된 값
  setSelected: (value: T) => void; // 선택 변경 핸들러
}

const MultipleRadioInput = <T extends InputAvailableEnum>({
  contents,
  labels,
  header,
  selected,
  setSelected,
} : RadioInputProps<T>) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`event.target.value: ${event.target.value}`);
    setSelected(event.target.value as unknown as T); // 선택된 값을 업데이트
  };

  return (
    <div>
      <h5>{header}</h5>
      {contents.map((content, index) => (
        <div className="form-check form-check-inline" key={index}>
          <input
            className="form-check-input"
            type="radio"
            name={`customRadioGroup-${header}`}
            id={`RadioInput${index}`}
            value={content}
            checked={selected === content} // 선택된 값과 비교하여 checked 설정
            onChange={handleChange}
            required
          />
          <label className="form-check-label" htmlFor={`RadioInput${index}`}>
            {labels[index]}
          </label>
        </div>
      ))}
      <hr />
      <br />
    </div>
  );
};

export default MultipleRadioInput;
