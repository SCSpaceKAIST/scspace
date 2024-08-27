"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import LoginCheck from "@Components/Auth/LoginCheck";

const Ask: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [list, setList] = useState<any[]>([]);
  const [totalPageNumber, setTotalPageNumber] = useState(1);
  const [login, setLogin] = useState(false);

  const handleStates = { wait: "대기중", receive: "접수됨", solve: "해결됨" };
  const router = useRouter();

  useEffect(() => {
    // LoginCheck와 callApi를 동시에 수행
    const fetchData = async () => {
      const loginResult = await LoginCheck();
      if (loginResult !== false) {
        setLogin(true);
      } else {
        setLogin(false);
      }

      const res = await callApi();
      setList(res);
      setTotalPageNumber(Math.ceil(res.length / 10));
    };

    fetchData();
  }, []);

  const callApi = async () => {
    const res = await axios.get("/api/ask/all");
    return res.data;
  };

  const onClickHandler = (link: string) => {
    router.push(link); // Next.js의 router.push를 사용하여 라우팅
  };

  return (
    <div id="main">
      <section>
        <div className="container">
          <div className="text-end">
            {login ? (
              <button type="button" className="modalButton1">
                <Link href="/ask/create">작성하기</Link>
              </button>
            ) : (
              <div />
            )}
          </div>
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
                    onClick={() => onClickHandler(`/ask/view/${contents.id}`)}
                  >
                    <td>{(pageNumber - 1) * 10 + idx + 1}</td>
                    <td>
                      <div className={contents.state} />
                      {typeof handleStates}
                    </td>
                    <td>{contents.title}</td>
                    <td>{contents.writer_id}</td>
                    <td>
                      {moment(contents.time_post).format("YYYY-MM-DD HH:mm:ss")}
                    </td>
                    <td>{contents.hits}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <section className="blog">
          <div className="blog-pagination">
            <ul className="justify-content-center">
              {[...Array(totalPageNumber)]
                .map((_, i) => i + 1)
                .map((pageNum) => (
                  <li
                    key={pageNum}
                    className={pageNumber === pageNum ? "active" : ""}
                    onClick={() => setPageNumber(pageNum)}
                  >
                    <Link href="#">{pageNum}</Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Ask;
