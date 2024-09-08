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
      <div className="col-md-6 form-group">
        <h5>{t("단체 이름")}</h5>
        <input
          type="text"
          name="organizationName"
          className="form-control"
          value={value}
          onChange={onChangeHandler}
          required
        />
      </div>
      <hr />
      <br />
    </div>
  );
};

export default Form;
