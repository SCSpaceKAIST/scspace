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
        <h5>{t("음식")}</h5>
        <input
          type="text"
          name="food"
          className="form-control"
          value={value}
          placeholder="음식물 섭취시 해당 음식물의 종류를 적어주세요."
          onChange={onChangeHandler}
        />
      </div>
      <hr />
      <br />
    </div>
  );
};

export default Form;
