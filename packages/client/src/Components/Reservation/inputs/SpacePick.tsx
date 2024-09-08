import React from "react";
import { useTranslation } from "react-i18next";

interface FormProps {
  spacelist: Record<string, string>;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form: React.FC<FormProps> = ({ spacelist, onChangeHandler }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h5>{t("장소")}</h5>
      {Object.keys(spacelist).map((space, index) => (
        <div className="form-check form-check-inline" key={index}>
          <input
            className="form-check-input"
            type="radio"
            name="space"
            id={`SpaceRadio${index}`}
            onChange={onChangeHandler}
            value={spacelist[space]}
            required
          />
          <label className="form-check-label" htmlFor={`SpaceRadio${index}`}>
            {t(space)}
          </label>
        </div>
      ))}
      <hr />
      <br />
    </div>
  );
};

export default Form;
