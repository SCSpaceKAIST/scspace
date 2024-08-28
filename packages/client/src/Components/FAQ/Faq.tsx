"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; // next/link 사용
import axios from "axios";
import LoginCheck from "../Auth/LoginCheck";
import { LckResType } from "@depot/types/auth";

interface FAQItem {
  id: number | null;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [idList, setIdList] = useState<number[]>([]);
  const [faqList, setFaqList] = useState<FAQItem[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [login, setLogin] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<LckResType>(false);

  useEffect(() => {
    LoginCheck().then((result) => {
      if (result !== false) {
        setLogin(true);
        setUserInfo(result);
      } else {
        setLogin(false);
      }
    });
  }, []);

  useEffect(() => {
    callApi()
      .then((res) => setFaqList(res))
      .catch((err) => console.log(err));
  }, [login]);

  const callApi = async (): Promise<FAQItem[]> => {
    const res = await axios.get("/api/faq/all");
    let body: FAQItem[] = await res.data;

    if (login === false) body = body.filter((d) => d.id !== 13);
    if (userInfo !== false && userInfo.type !== "admin") {
      body = body.filter((d) => d.id !== 13);
    }

    return body;
  };

  const callApiEdit = async (idx: number) => {
    // not yet
    const url = "/api/faq/update";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios.post(url, JSON.stringify(faqList[idx]), config);
    setEditIdx(null);
  };

  const callApiDelete = async (faq_id: number | null) => {
    // not yet
    await axios.get("/api/faq" + faq_id);
    const updatedFaqs = await callApi();
    setFaqList(updatedFaqs);
  };

  const callApiAdd = async (idx: number) => {
    // not yet
    const url = "/api/faq/create";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios.post(url, JSON.stringify(faqList[idx]), config);
    const updatedFaqs = await callApi();
    setFaqList(updatedFaqs);
  };

  const addFaq = (mode: "add" | "cancel") => {
    if (mode === "cancel") {
      setFaqList(faqList.slice(0, -1));
    } else {
      setFaqList([
        ...faqList,
        { id: null, question: "Question", answer: "Answer" },
      ]);
    }
  };

  const editFaq = (idx: number) => {
    setEditIdx(editIdx === idx ? null : idx);
  };

  const deleteFaq = (idx: number) => {
    callApiDelete(faqList[idx].id)
      .then(() => {
        // handle successful deletion if necessary
      })
      .catch((err) => console.log(err));
  };

  const changeHandler = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let updatedFaqList = [...faqList];
    //updatedFaqList[idx][e.target.name as keyof FAQItem] = e.target.value;

    setFaqList(updatedFaqList);
  };

  const toggleAccordion = (idx: number) => {
    setIdList(
      idList.includes(idx)
        ? idList.filter((id) => id !== idx)
        : [...idList, idx]
    );
  };

  const renderAdminButtons = (idx: number) => {
    if (userInfo !== false && userInfo?.type === "admin") {
      if (editIdx === idx) {
        return (
          <div className="text-end">
            <button
              type="button"
              className="modalButton2"
              onClick={() => callApiEdit(idx)}
            >
              수정 완료
            </button>
            <button
              type="button"
              className="modalButton1"
              onClick={() => editFaq(idx)}
            >
              취소
            </button>
          </div>
        );
      } else if (faqList[idx].id === null) {
        return (
          <div className="text-end">
            <button
              type="button"
              className="modalButton2"
              onClick={() => callApiAdd(idx)}
            >
              추가 완료
            </button>
            <button
              type="button"
              className="modalButton1"
              onClick={() => addFaq("cancel")}
            >
              취소
            </button>
          </div>
        );
      } else {
        return (
          <div className="text-end">
            <button
              type="button"
              className="modalButton2"
              onClick={() => editFaq(idx)}
            >
              수정
            </button>
            <button
              type="button"
              className="modalButton1"
              onClick={() => deleteFaq(idx)}
            >
              삭제
            </button>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <section>
      <div>
        <section id="faq" className="faq">
          <div className="container-fluid">
            <div className="row gy-4">
              <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch order-2 order-lg-1">
                <div className="content px-xl-5">
                  <h3>
                    Frequently Asked <strong>Questions</strong>
                  </h3>
                  <p>많이 주신 질문들에 대한 답변입니다.</p>
                </div>
                {userInfo !== false && userInfo?.type === "admin" && (
                  <div className="text-end">
                    <button
                      type="button"
                      className="modalButton2"
                      onClick={() => addFaq("add")}
                    >
                      추가하기
                    </button>
                  </div>
                )}
                <div className="accordion accordion-flush px-xl-5">
                  {faqList.map((contents, idx) => (
                    <div className="accordion-item" key={idx}>
                      <h3 className="accordion-header">
                        <button
                          className={`accordion-button ${idList.includes(idx) ? "" : "collapsed"}`}
                          onClick={() => toggleAccordion(idx)}
                        >
                          <i className="bi bi-question-circle question-icon"></i>
                          {editIdx === idx || contents.id === null ? (
                            <input
                              type="text"
                              name="question"
                              onChange={(e) => changeHandler(idx, e)}
                              value={contents.question}
                            />
                          ) : (
                            contents.question
                          )}
                        </button>
                      </h3>
                      <div
                        className={`accordion-collapse ${idList.includes(idx) ? "" : "collapse"}`}
                      >
                        <div className="accordion-body">
                          {editIdx === idx || contents.id === null ? (
                            <input
                              type="text"
                              name="answer"
                              onChange={(e) => changeHandler(idx, e)}
                              value={contents.answer}
                            />
                          ) : (
                            contents.answer
                          )}
                          {renderAdminButtons(idx)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-5 align-items-stretch order-1 order-lg-2 img">
                &nbsp;
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default FAQ;
