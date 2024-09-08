import React from "react";
import { useTranslation } from "react-i18next";

interface FormProps {
  head: string;
  checkboxlist: Record<string, string>;
  name: string;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hr?: boolean;
}

const Form: React.FC<FormProps> = ({
  head,
  checkboxlist,
  name,
  onChangeHandler,
  hr,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h5>{t(head)}</h5>
      {Object.keys(checkboxlist).map((member, index) => (
        <div className="form-check form-check-inline" key={index}>
          <input
            className="form-check-input"
            name={name}
            type="checkbox"
            id={`MemberChkBx${index}`}
            value={checkboxlist[member]}
            onChange={onChangeHandler}
          />
          <label className="form-check-label" htmlFor={`MemberChkBx${index}`}>
            {member}
          </label>
        </div>
      ))}
      {hr ? <hr /> : null}
      <br />
    </div>
  );
};

export default Form;
