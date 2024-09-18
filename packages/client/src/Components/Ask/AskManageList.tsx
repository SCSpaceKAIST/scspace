"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import { useBoardData } from "@/Hooks/useBoardData";
import { AskType, askStateOptions } from "@depot/types/ask";
import { useLinkPush } from "@/Hooks/useLinkPush";

const AskLatestList: React.FC = () => {
  const { linkPush } = useLinkPush();

  const { list, pageNumber, totalPageNumber, setPageNumber, login } =
    useBoardData<AskType>({
      apiEndpoint: "/api/ask/latest",
      itemsPerPage: 5,
      sortDesc: true,
    });

  const [wait, setWait] = useState<number>(list.length);
  useEffect(() => {
    setWait(list.length);
  }, [list]);

  const onClickHandler = (link: string) => {
    linkPush(link);
  };

  return (
    <main id="main">
      <div className="container">
        <br />
        <h4>
          <b>최신 문의 목록</b>
        </h4>
        <h6>
          <b>
            <Link href="./ask">{wait}개 대기중</Link>
          </b>
        </h6>
        <hr />

        <table className="table manage">
          <thead>
            <tr>
              <th>처리 상태</th>
              <th>제목</th>
              <th>글쓴이</th>
              <th>작성 시간</th>
            </tr>
          </thead>
          <tbody>
            {list
              .slice((pageNumber - 1) * 5, pageNumber * 5)
              .map((contents, idx) => (
                <tr
                  key={idx}
                  onClick={() => onClickHandler(`/ask/view/${contents.id}`)}
                >
                  <td>
                    <div className={contents.state} />
                    {askStateOptions[contents.state]}
                  </td>
                  <td>{contents.title}</td>
                  <td>{contents.user_id}</td>
                  <td>
                    {moment(contents.time_post).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="blog">
        <div className="blog-pagination">
          <ul className="justify-content-center">
            {Array.from({ length: totalPageNumber }, (_, i) => i + 1).map(
              (pageNum) => (
                <li
                  key={pageNum}
                  className={pageNumber === pageNum ? "active" : ""}
                  onClick={() => setPageNumber(pageNum)}
                >
                  <Link href="#">{pageNum}</Link>
                </li>
              )
            )}
          </ul>
        </div>
        <br />
      </div>
    </main>
  );
};

export default AskLatestList;
