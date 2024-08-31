"use client";

//Board부분을 자동화하고 싶었으나, 너무 사용하기 어려운 것 같아 포기.

import React from "react";
import moment from "moment";

const handleStates = {
  wait: "대기중",
  receive: "접수됨",
  solve: "해결됨",
} as const;

type StateType = keyof typeof handleStates;

interface boardTypes {
  title: string;
  state: StateType;
  user_id: string;
  time_post: Date;
  views: number;
}
// 파라미터를 객체로 그룹화
type TableElementParams<T> = {
  contents: T;
  idx: number;
  pageNumber: number;
};

// 새로운 타입을 이용한 정의
type TableElementFunction<T> = (
  params: TableElementParams<T>
) => JSX.Element | string | number;

interface TableElements<T> {
  No: TableElementFunction<T>;
  "처리 상태": TableElementFunction<T>;
  제목: TableElementFunction<T>;
  글쓴이: TableElementFunction<T>;
  날짜: TableElementFunction<T>;
  조회수: TableElementFunction<T>;
}

interface BoardListProps<T extends boardTypes> {
  list: T[];
  pageNumber: number;
  tableElements: TableElements<T>;
}

function linkPush(txt: string) {}

const BoardList = <T extends boardTypes>({
  list,
  pageNumber,
  tableElements,
}: BoardListProps<T>) => {
  const clickFunc = (id: number) => linkPush(`/ask/view/${id}`);
  // 함수 사용 시
  tableElements = {
    No: ({ idx, pageNumber }) => (pageNumber - 1) * 10 + idx + 1,
    "처리 상태": ({ contents }) => (
      <>
        <div className={contents.state} /> {handleStates[contents.state]}
      </>
    ),
    제목: ({ contents }) => contents.title,
    글쓴이: ({ contents }) => contents.user_id,
    날짜: ({ contents }) =>
      moment(contents.time_post).format("YYYY-MM-DD HH:mm:ss"),
    조회수: ({ contents }) => contents.views,
  };

  const tableHeaders = Object.keys(tableElements) as Array<
    keyof TableElements<T>
  >;

  return (
    <div className="container">
      <table className="table manage">
        <thead>
          <tr>
            {tableHeaders.map((contents, idx) => (
              <th key={idx}>{contents}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {list
            .slice((pageNumber - 1) * 10, pageNumber * 10)
            .map((contents, idx) => (
              <tr key={idx} onClick={() => clickFunc(idx)}>
                {tableHeaders.map((content, index) => (
                  <td key={index}>
                    {tableElements[content]({ contents, idx, pageNumber })}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardList;
