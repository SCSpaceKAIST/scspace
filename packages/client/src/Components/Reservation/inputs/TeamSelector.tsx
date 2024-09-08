import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface FormProps {
  teamlist: { id: string; name: string }[];
  onChangeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Form: React.FC<FormProps> = ({ teamlist, onChangeHandler }) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="col-md-6 form-group">
        <h5>{t("팀")}</h5>
        <select
          className="form-control"
          name="teamId"
          onChange={onChangeHandler}
          required
        >
          {teamlist.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <br />
        <p className="space">
          {t("팀이 없으면 팀 등록을 해주세요.")}
          <Link className="btn-getstarted scrollto" href="/team/create">
            &nbsp;{t("등록하기")}
          </Link>
        </p>
      </div>
      <hr />
      <br />
    </div>
  );
};

export default Form;
