import React from "react";

interface TextInputProps {
  label: string; // 라벨 텍스트
  text: string; // 입력된 값
  setText: (value: string) => void; // 입력값 변경 핸들러
}

const TextInput: React.FC<TextInputProps> = ({ label, text, setText }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value); // 입력값이 변경되면 setText를 통해 업데이트
  };

  return (
    <div>
      <div className="col-md-12 form-group">
        <h5>{label}</h5>
        <input
          type="text"
          className="form-control"
          value={text}
          onChange={handleChange}
          required
        />
      </div>
      <hr />
    </div>
  );
};

export default TextInput;
