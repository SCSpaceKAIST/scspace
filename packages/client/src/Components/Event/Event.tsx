"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
//import AOS from "aos";
//import "aos/dist/aos.css";
import LoginCheck from "@/Hooks/LoginCheck";

const Event: React.FC = () => {
  const { t } = useTranslation();
  const [login, setLogin] = useState(false);
  const [userInfo, setUserInfo] = useState<{ type: string } | null>(null);

  useEffect(() => {
    // 로그인 상태 체크 (LoginCheck 함수는 필요한 경우에 맞게 수정 필요)
    LoginCheck().then((result) => {
      if (result !== false) {
        setLogin(true);
        setUserInfo(result);
      }
    });
    //AOS.init();
  }, []);

  return (
    <div id="main">
      <div className="container">
        {login && userInfo?.type === "admin" ? (
          <div className="text-end">
            <Link href="/event/createevent">
              <button type="button" className="modalButton1">
                작성하기
              </button>
            </Link>
          </div>
        ) : null}
      </div>
      <br />

      <div className="container-fluid" data-aos-delay="200">
        <div className="portfolio-isotope">
          <div className="container">
            <div className="row g-0 portfolio-container">
              <div className="col-xl-3 col-lg-4 col-md-6 portfolio-item filter-app">
                <img
                  src="/img/championsleague3.jpg"
                  className="img-fluid"
                  alt=""
                />
                <div className="portfolio-info">
                  <h4>단체관람 이벤트</h4>
                  <a
                    href="https://www.instagram.com/p/CxClPbMrZ0x/"
                    target="_blank"
                    title="인스타그램 링크"
                    className="glightbox preview-link"
                  >
                    <i className="bi bi-zoom-in"></i>
                  </a>
                  <a
                    href="https://forms.gle/yXQJGTUK8LsCPBw19"
                    target="_blank"
                    title="관련 링크"
                    className="details-link"
                  >
                    <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 portfolio-item filter-app">
                <img src="/img/dinosaur.png" className="img-fluid" alt="" />
                <div className="portfolio-info">
                  <h4>공룡간식 이벤트</h4>
                  <a
                    href="https://www.instagram.com/p/CxUykS0LYx6/"
                    target="_blank"
                    title="인스타그램 링크"
                    className="glightbox preview-link"
                  >
                    <i className="bi bi-zoom-in"></i>
                  </a>
                  <a
                    href="/"
                    target="_blank"
                    title="관련 링크"
                    className="details-link"
                  >
                    <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 portfolio-item filter-app">
                <img
                  src="/img/championsleague2.jpg"
                  className="img-fluid"
                  alt=""
                />
                <div className="portfolio-info">
                  <h4>챔스 단체관람</h4>
                  <a
                    href="https://www.instagram.com/p/Cry1FEDhxxr/"
                    target="_blank"
                    title="인스타그램 링크"
                    className="glightbox preview-link"
                  >
                    <i className="bi bi-zoom-in"></i>
                  </a>
                  <a
                    href="https://forms.gle/TmSdqVe6gMQK2ou77"
                    target="_blank"
                    title="관련 링크"
                    className="details-link"
                  >
                    <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 portfolio-item filter-app">
                <img
                  src="/img/findtreasure2.jpg"
                  className="img-fluid"
                  alt=""
                />
                <div className="portfolio-info">
                  <h4>신학관 보물찾기</h4>
                  <a
                    href="https://www.instagram.com/p/CqCSxTkr5oH/"
                    target="_blank"
                    title="인스타그램 링크"
                    className="glightbox preview-link"
                  >
                    <i className="bi bi-zoom-in"></i>
                  </a>
                  <a
                    href="https://forms.gle/T4yu2NyKrbfSBtJQ7"
                    target="_blank"
                    title="관련 링크"
                    className="details-link"
                  >
                    <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 portfolio-item filter-app">
                <img src="/img/easteregg2.jpg" className="img-fluid" alt="" />
                <div className="portfolio-info">
                  <h4>이스터에그 이벤트</h4>
                  <a
                    href="https://www.instagram.com/p/ClQb721uO2_/"
                    target="_blank"
                    title="인스타그램 링크"
                    className="glightbox preview-link"
                  >
                    <i className="bi bi-zoom-in"></i>
                  </a>
                  <a
                    href="https://forms.gle/WjM1s2e7gkJJpZ4M6"
                    target="_blank"
                    title="관련 링크"
                    className="details-link"
                  >
                    <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 portfolio-item filter-app">
                <img src="/img/worldcup2.jpg" className="img-fluid" alt="" />
                <div className="portfolio-info">
                  <h4>월드컵 이벤트</h4>
                  <a
                    href="https://www.instagram.com/p/ClNzE_ludaz/"
                    target="_blank"
                    title="인스타그램 링크"
                    className="glightbox preview-link"
                  >
                    <i className="bi bi-zoom-in"></i>
                  </a>
                  <a
                    href="https://docs.google.com/forms/d/1yRqLRhGucR6zWy34vNgAcXduuY0stqAssQxUUbiz8Cw/edit"
                    target="_blank"
                    title="관련 링크"
                    className="details-link"
                  >
                    <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
