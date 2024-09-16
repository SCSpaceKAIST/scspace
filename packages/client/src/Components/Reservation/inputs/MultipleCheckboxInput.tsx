import React from "react";
import { useTranslation } from "react-i18next";

interface MultipleCheckboxInputProps {
  contents: string[]; // 체크박스의 value 값
  labels: string[]; // 라벨로 표시될 텍스트
  header: string; // 상단 헤더 텍스트
  selected: string[]; // 선택된 값들의 배열
  setSelected: (value: string[]) => void; // 선택 변경 핸들러
}

const MultipleCheckboxInput: React.FC<MultipleCheckboxInputProps> = ({
  contents,
  labels,
  header,
  selected,
  setSelected,
}) => {
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (checked) {
      // 체크박스가 체크되면 배열에 추가
      setSelected([...selected, value]);
    } else {
      // 체크 해제되면 배열에서 제거
      setSelected(selected.filter((item) => item !== value));
    }
  };

  return (
    <div>
      <h5>{t(header)}</h5>
      {contents.map((content, index) => (
        <div className="form-check form-check-inline" key={index}>
          <input
            className="form-check-input"
            type="checkbox"
            id={`CheckboxInput${index}`}
            value={content}
            checked={selected.includes(content)} // 선택된 값 배열에 포함되어 있으면 체크
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor={`CheckboxInput${index}`}>
            {t(labels[index])}
          </label>
        </div>
      ))}
      <hr />
      <br />
    </div>
  );
};

export default MultipleCheckboxInput;
