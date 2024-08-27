import React from "react";
import Link from "next/link"; // react-router-dom 대신 next/link 사용
import { useTranslation } from "react-i18next";

const Banner: React.FC = () => {
  //const { t } = useTranslation();
  const t = (text: string): string => text;

  return (
    <section className="hero-static d-flex align-items-center">
      <div className="container d-flex flex-column justify-content-center align-items-center text-center position-relative">
        <img src="/img/logo.svg" alt="" className="img-fluid main-photo" />
        <br />
        <p>{t("학생문화공간위원회 홈페이지에 오신 것을 환영합니다.")}</p>
        <div className="d-flex">
          <Link href="/reservation" passHref>
            <div className="btn-get-started scrollto">{t("예약하기")}</div>
          </Link>
          <Link href="/calendar" passHref>
            <div className="btn-get-started2">{t("예약 현황")}</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;
