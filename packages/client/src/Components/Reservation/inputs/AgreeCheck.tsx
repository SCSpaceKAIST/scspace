import { useTranslation } from "react-i18next";
import React from "react";
import CheckboxInput from "./CheckboxInput";

interface AgreeCheckProps {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const AgreeInput: React.FC<AgreeCheckProps> = ({ checked, setChecked }) => {
  const { t } = useTranslation();
  return (
    <div>
      <a
        href="https://scspace-public.s3.ap-northeast-2.amazonaws.com/ToS.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("공간위 통합 약관 확인하기")}
      </a>
      <br />
      <CheckboxInput
        label={
          "본인은 이용자 전체를 대표하여 유의사항 및 공간위 통합 약관을 확인했으며 이에 동의합니다."
        }
        checked={checked}
        setChecked={setChecked}
      />
    </div>
  );
};

export default AgreeInput;
