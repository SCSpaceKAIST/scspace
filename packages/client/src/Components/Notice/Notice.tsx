"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { INotice } from "@scspace-depot/types/notice";
import BoardPageSelector from "@scspace-client/Components/_commons/BoardPageSelector";
import ConditionalButton from "@scspace-client/Components/_commons/ConditionalButton";
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";
import { useBoardData } from "@scspace-client/Hooks/useBoardData";
import { useLoginCheck } from "@scspace-client/Hooks/useLoginCheck";

const Notice: React.FC = () => {
  const { linkPush } = useLinkPush();

  const ROW_PER_PAGE = 10;
  const { isSCS } = useLoginCheck();
  const { list, pageNumber, totalPageNumber, setPageNumber, login, userInfo } =
    useBoardData<INotice>({
      apiEndpoint: "/api/notice/all",
    });

  const callApi = async (): Promise<INotice[]> => {
    const res = await axios.get("/api/notice/all");
    //return res.data;

    // res.data를 timePost 기준으로 내림차순 정렬
    const sortedData = res.data.sort((a: INotice, b: INotice) => {
      return new Date(b.timePost).getTime() - new Date(a.timePost).getTime();
    });

    return sortedData;
  };

  return (
    <div id="main">
      <section>
        <ConditionalButton
          condition={login === true && isSCS()}
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
                <th>{"제목"}</th>
                <th>{"날짜"}</th>
                <th>{"조회수"}</th>
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
                          contents.id //(pageNumber - 1) * ROW_PER_PAGE + idx + 1
                        )}
                      </td>
                      <td>{contents.title}</td>
                      <td>
                        {moment(
                          contents.timeEdit ?? contents.timePost
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
