import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface RadioInputProps {
  contents: string[]; // 라디오 버튼의 value 값
  labels: string[]; // 라벨로 표시될 텍스트
  header: string; // 상단 헤더 텍스트
  selected: string | null; // 선택된 값
  setSelected: (value: string) => void; // 선택 변경 핸들러
}

const MultipleRadioInput: React.FC<RadioInputProps> = ({
  contents,
  labels,
  header,
  selected,
  setSelected,
}) => {
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.value); // 선택된 값을 업데이트
  };

  return (
    <div>
      <h5>{t(header)}</h5>
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
            {t(labels[index])}
          </label>
        </div>
      ))}
      <hr />
      <br />
    </div>
  );
};

export default MultipleRadioInput;
