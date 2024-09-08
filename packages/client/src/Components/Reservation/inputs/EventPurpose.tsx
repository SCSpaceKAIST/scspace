import React from "react";
import { useTranslation } from "react-i18next";

interface FormProps {
  value: string;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form: React.FC<FormProps> = ({ value, onChangeHandler }) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="form-group mt-3">
        <h5>{t("행사 목적")}</h5>
        <input
          type="text"
          name="eventPurpose"
          className="form-control"
          onChange={onChangeHandler}
          value={value}
          required
        />
      </div>
      <hr />
      <br />
    </div>
  );
};

export default Form;
