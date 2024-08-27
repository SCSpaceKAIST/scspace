"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import LoginCheck from "@Components/Auth/LoginCheck";
import { useTranslation } from "react-i18next";

const Notice: React.FC = () => {
  const { t } = useTranslation();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPageNumber, setTPN] = useState(1);
  const [list, setList] = useState<any[]>([]);
  const [login, setLogin] = useState(false);
  const [UserInfo, setUserInfo] = useState<any | null>(null);

  const callApi = async () => {
    const res = await axios.get("/api/notice/all");
    return res.data;
  };

  const onClickHandler = (link: string) => {
    window.location.href = link; // Next.js에서는 `router.push`를 사용하거나, 간단히 `window.location.href`를 이용할 수 있습니다.
  };

  useEffect(() => {
    LoginCheck().then((result) => {
      if (result !== false) {
        setLogin(true);
        setUserInfo(result);
      }
    });

    callApi()
      .then((res) => {
        setList(res);
        setTPN(Math.ceil(res.length / 10));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div id="main">
      <section>
        <div className="container">
          {login === true && UserInfo?.type === "admin" ? (
            <div className="text-end">
              <button type="button" className="modalButton1">
                <Link href="/notice/create">작성하기</Link>
              </button>
            </div>
          ) : null}
        </div>
        <br />
        <div className="container">
          <table className="table manage">
            <thead>
              <tr>
                <th>No</th>
                <th>{t("제목")}</th>
                <th>{t("날짜")}</th>
                <th>{t("조회수")}</th>
              </tr>
            </thead>
            <tbody>
              {list
                .slice((pageNumber - 1) * 10, pageNumber * 10)
                .map((contents, idx) => {
                  return (
                    <tr
                      key={idx}
                      onClick={() =>
                        onClickHandler("/notice/view/" + contents.id)
                      }
                    >
                      <td>
                        {contents.important ? (
                          <b style={{ color: "var(--color-primary-light)" }}>
                            필독
                          </b>
                        ) : (
                          (pageNumber - 1) * 10 + idx + 1
                        )}
                      </td>
                      <td>{contents.title}</td>
                      <td>
                        {moment(
                          contents.time_edit ?? contents.time_post
                        ).format("YYYY-MM-DD HH:mm:ss")}
                      </td>
                      <td>{contents.hits}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <section className="blog">
          <div className="blog-pagination">
            <ul className="justify-content-center">
              {[...Array(totalPageNumber)]
                .map((_, i) => i + 1)
                .map((pagenum) => (
                  <li
                    key={pagenum}
                    className={pageNumber === pagenum ? "active" : ""}
                    onClick={() => setPageNumber(pagenum)}
                  >
                    <Link href="#">{pagenum}</Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Notice;
