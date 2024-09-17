import Link from "next/link";
import React from "react";

interface DropdownInputProps {
  item_list: { [id: number]: string }; // 항목 ID와 이름이 매핑된 객체
  selected: number; // 선택된 항목 ID
  setSelected: (id: number) => void; // 선택된 항목을 변경하는 함수
  label: string; // 제목으로 사용할 라벨
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  item_list,
  selected,
  setSelected,
  label,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(Number(event.target.value)); // 선택된 ID를 number로 변환하여 setSelected 호출
  };

  return (
    <div>
      <div className="col-md-6 form-group">
        <h5>{label}</h5> {/* 전달받은 label을 제목으로 사용 */}
        <select
          className="form-control"
          value={selected} // 현재 선택된 ID
          onChange={handleChange} // 선택이 변경될 때 호출되는 함수
          required
        >
          {Object.entries(item_list).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <br />
        <p className="space">
          선택 항목이 없다면 등록을 해주세요.{" "}
          <Link href="/item/create" className="btn-getstarted scrollto">
            등록하기
          </Link>
        </p>
      </div>
      <hr />
      <br />
    </div>
  );
};

export default DropdownInput;
