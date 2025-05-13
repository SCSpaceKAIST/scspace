import React, { ChangeEvent } from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckboxInput: React.FC<CheckboxProps> = ({
  label,
  checked,
  setChecked,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="checkbox"
          id="AgreeToTerms"
          value="agree"
          checked={checked}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="AgreeToTerms">
          {label}
        </label>
      </div>
      <hr />
    </div>
  );
};

export default CheckboxInput;
