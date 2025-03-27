"use client";
import React, { useState, useEffect } from "react";

import axios from "axios";

import { IFaq } from "@scspace-depot/types/faq";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import ConditionalButton from "../_commons/ConditionalButton";
import { useQueryApi } from "@scspace-client/Hooks/useApi";

const FAQ: React.FC = () => {
  const [idList, setIdList] = useState<number[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const { isSCS } = useLoginCheck();

  const { data: faqList } = useQueryApi<IFaq[]>("/faq/all");

  const callApiEdit = async (idx: number) => {
    // faq 수정하는 mutation 호출 및 추가 로직 구현
  };

  const callApiDelete = async (faq_id: number | null) => {
    // faq 삭제하는 mutation 호출 및 삭제 로직 구현
  };

  const callApiAdd = async (idx: number) => {
    // faq 추가하는 mutation 호출 및 추가 로직 구현
  };

  const addFaq = (mode: "add" | "cancel") => {
    // faq 추가 관련 로직
  };

  const editFaq = (idx: number) => {
    setEditIdx(editIdx === idx ? null : idx);
  };

  const deleteFaq = (idx: number) => {
    callApiDelete(faqList?.[idx].id ?? 0)
      .then(() => {
        // handle successful deletion if necessary
      })
      .catch(err => console.log(err));
  };

  const changeHandler = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // 뭐를 위한 거였을까...
  };

  const toggleAccordion = (idx: number) => {
    setIdList(
      idList.includes(idx) ? idList.filter(id => id !== idx) : [...idList, idx],
    );
  };

  const renderAdminButtons = (idx: number) => {
    if (isSCS()) {
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
      } else if (faqList?.[idx].id === null) {
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
                  <div>많이 주신 질문들에 대한 답변입니다.</div>
                </div>

                <ConditionalButton
                  condition={isSCS()}
                  className="modalButton2"
                  onClick={() => addFaq("add")}
                >
                  추가하기
                </ConditionalButton>
                <div className="accordion accordion-flush px-xl-5">
                  {faqList?.map((contents, idx) => (
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
                              onChange={e => changeHandler(idx, e)}
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
                              onChange={e => changeHandler(idx, e)}
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
