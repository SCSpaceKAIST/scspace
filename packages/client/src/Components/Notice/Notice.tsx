"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import { useTranslation } from "react-i18next";
import { NoticeType } from "@depot/types/notice";
import BoardPageSelector from "@Components/_commons/BoardPageSelector";
import ConditionalButton from "@Components/_commons/ConditionalButton";
import { useLinkPush } from "@Hooks/useLinkPush";
import { useBoardData } from "@/Hooks/useBoardData";

const Notice: React.FC = () => {
  const { t } = useTranslation();

  const { linkPush } = useLinkPush();

  const ROW_PER_PAGE = 10;
  const { list, pageNumber, totalPageNumber, setPageNumber, login, userInfo } =
    useBoardData<NoticeType>({
      apiEndpoint: "/api/notice/all",
    });

  const callApi = async (): Promise<NoticeType[]> => {
    const res = await axios.get("/api/notice/all");
    //return res.data;

    // res.data를 time_post 기준으로 내림차순 정렬
    const sortedData = res.data.sort((a: NoticeType, b: NoticeType) => {
      return new Date(b.time_post).getTime() - new Date(a.time_post).getTime();
    });

    return sortedData;
  };

  return (
    <div id="main">
      <section>
        <ConditionalButton
          condition={login === true && userInfo?.type === "admin"}
          btnLink="/notice/create"
        >
          작성하기
        </ConditionalButton>
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
                .slice(
                  (pageNumber - 1) * ROW_PER_PAGE,
                  pageNumber * ROW_PER_PAGE
                )
                .map((contents, idx) => {
                  return (
                    <tr
                      key={idx}
                      onClick={() => linkPush("/notice/view/" + contents.id)}
                    >
                      <td>
                        {contents.important ? (
                          <b style={{ color: "var(--color-primary-light)" }}>
                            필독
                          </b>
                        ) : (
                          (pageNumber - 1) * ROW_PER_PAGE + idx + 1
                        )}
                      </td>
                      <td>{contents.title}</td>
                      <td>
                        {moment(
                          contents.time_edit ?? contents.time_post
                        ).format("YYYY-MM-DD HH:mm:ss")}
                      </td>
                      <td>{contents.views}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <BoardPageSelector
          totalPageNumber={totalPageNumber}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </section>
    </div>
  );
};

export default Notice;
