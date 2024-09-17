"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";

import { AskType } from "@depot/types/ask";
import BoardPageSelector from "@Components/_commons/BoardPageSelector";
import ConditionalButton from "@/Components/_commons/ConditionalButton";
import { useLinkPush } from "@Hooks/useLinkPush";
import { useBoardData } from "@/Hooks/useBoardData";
import AlertBtn from "@Components/_commons/AlertBtn";

const ReservationList: React.FC = () => {
  const { linkPush } = useLinkPush();

  const handleStates = { wait: "대기중", receive: "접수됨", solve: "해결됨" };

  const { list, pageNumber, totalPageNumber, setPageNumber, login } =
    useBoardData<AskType>({
      apiEndpoint: "/api/ask/all",
    });

  return (
    <div id="main">
      <section>
        <div className="container">
          <ConditionalButton condition={login} btnLink="/ask/create">
            작성하기
          </ConditionalButton>
        </div>
        <br />

        <div className="container">
          <table className="table manage">
            <thead>
              <tr>
                <th>No</th>
                <th>처리 상태</th>
                <th>제목</th>
                <th>글쓴이</th>
                <th>날짜</th>
                <th>조회수</th>
              </tr>
            </thead>

            <tbody>
              {list
                .slice((pageNumber - 1) * 10, pageNumber * 10)
                .map((contents, idx) => (
                  <tr
                    key={idx}
                    onClick={() => linkPush(`/ask/view/${contents.id}`)}
                  >
                    <td>{contents.id}</td>
                    <td>
                      <div className={contents.state} />
                      {handleStates[contents.state]}
                    </td>
                    <td>{contents.title}</td>
                    <td>{contents.user_id}</td>
                    <td>
                      {moment(contents.time_post).format("YYYY-MM-DD HH:mm:ss")}
                    </td>
                    <td>{contents.views}</td>
                  </tr>
                ))}
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

export default ReservationList;
