import React from "react";
import { useTranslation } from "react-i18next";

interface FormProps {
  type?: boolean;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form: React.FC<FormProps> = ({ type, onChangeHandler }) => {
  const { t } = useTranslation();

  return (
    <div>
      {type ? (
        <div className="col-md-6 form-group">
          <h5>{t("예상 참여 인원")}</h5>
          <input
            type="number"
            onChange={onChangeHandler}
            className="form-control"
            name="number"
            min="0"
            max="30"
            step="1"
            required
          />
        </div>
      ) : (
        <div className="row">
          <h5>{t("예상 참여 인원")}</h5>
          <div className="col-md-6 form-group">
            {t("학내구성원")}
            <input
              type="number"
              onChange={onChangeHandler}
              className="form-control"
              name="inner_number"
              min="0"
              max="200"
              step="1"
              required
            />
          </div>
          <div className="col-md-6 form-group mt-3 mt-md-0">
            {t("외부인")}
            <input
              type="number"
              onChange={onChangeHandler}
              className="form-control"
              name="outer_number"
              min="0"
              max="200"
              step="1"
              required
            />
          </div>
        </div>
      )}
      <hr />
      <br />
    </div>
  );
};

export default Form;
