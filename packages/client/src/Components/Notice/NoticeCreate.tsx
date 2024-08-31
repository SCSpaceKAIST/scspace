"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useLoginCheck } from "@Hooks/useLoginCheck";

interface NoticeCreateProps {
  title?: string;
  content?: string;
  important?: boolean;
}

const NoticeCreate: React.FC = () => {
  const [_state, _setState] = useState<NoticeCreateProps>({
    title: "",
    content: "",
    important: false,
  });
  const { userInfo } = useLoginCheck();
  const router = useRouter();

  const sendPost = () => {
    const url = `/api/notice/`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return axios.post(url, JSON.stringify(_state), config);
  };

  const checkSubmit = () => {
    return true;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (checkSubmit()) {
      sendPost().then(() => {
        router.push("/notice");
      });
    } else {
      alert("Error occurred. Please check the form.");
    }
  };

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    _setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const onChangeValue = () => {
    _setState((prevState) => ({
      ...prevState,
      important: !prevState.important,
    }));
  };

  return (
    <div id="main">
      <section id="contact" className="contact">
        <div className="container">
          <div className="row gy-5 gx-lg-5">
            <div>
              <form className="php-email-form" onSubmit={handleSubmit}>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder="제목"
                    value={_state.title}
                    onChange={handleValueChange}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <textarea
                    className="form-control"
                    name="content"
                    placeholder="공지 내용"
                    value={_state.content}
                    onChange={handleValueChange}
                    required
                  />
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    name="important"
                    type="checkbox"
                    id="isImportantNoticeChkbx"
                    checked={_state.important}
                    onChange={onChangeValue}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="isImportantNoticeChkbx"
                  >
                    중요 공지
                  </label>
                </div>
                <div className="text-center">
                  <button type="submit">작성하기</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NoticeCreate;
