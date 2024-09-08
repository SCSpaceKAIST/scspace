import React from "react";
import { useTranslation } from "react-i18next";

interface FormProps {
  value: string;
  onChangeHandler: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Form: React.FC<FormProps> = ({ value, onChangeHandler }) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="form-group mt-3">
        <h5>{t("행사 내용")}</h5>
        <textarea
          className="form-control"
          name="contents"
          value={value}
          onChange={onChangeHandler}
          placeholder="행사의 자세한 내용을 알려주세요. 이 내용은 학생문화공간위원회에 전달됩니다."
          required
        />
      </div>
      <hr />
      <br />
    </div>
  );
};

export default Form;
