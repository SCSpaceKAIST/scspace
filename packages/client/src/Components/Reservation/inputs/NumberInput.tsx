import React from "react";

interface NumberInputProps {
  label: string; // 라벨 텍스트
  num: number; // 입력된 숫자 값
  setNum: (value: number) => void; // 숫자 입력값 변경 핸들러
}

const NumberInput: React.FC<NumberInputProps> = ({ label, num, setNum }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber; // 입력된 값을 숫자로 가져옴
    if (!isNaN(value)) {
      // 값이 숫자일 때만 업데이트
      setNum(value);
    }
  };

  return (
    <div>
      <div className="col-md-12 form-group">
        <h5>{label}</h5>
        <input
          type="number" // 숫자 입력으로 변경
          className="form-control"
          value={num}
          onChange={handleChange}
          required
        />
      </div>
      <hr />
    </div>
  );
};

export default NumberInput;
