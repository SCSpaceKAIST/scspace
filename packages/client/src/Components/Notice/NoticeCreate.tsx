"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useLoginCheck } from "@Hooks/useLoginCheck";
import { NoticeInputType } from "@depot/types/notice";
import { useLinkPush } from "@/Hooks/useLinkPush";

const NoticeCreate: React.FC = () => {
  const { userInfo } = useLoginCheck();
  const { linkPush } = useLinkPush();
  const [noticeContent, setNoticeContent] = useState<NoticeInputType>({
    title: "",
    content: "",
    important: 0,
    user_id: userInfo?.user_id ? userInfo?.user_id : "",
  });

  useEffect(() => {
    setNoticeContent({
      title: "",
      content: "",
      important: 0,
      user_id: userInfo?.user_id ? userInfo?.user_id : "",
    });
  }, [userInfo]);

  const sendPost = async () => {
    alert(JSON.stringify(noticeContent));

    const response = await fetch("/api/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noticeContent),
    });
    return response;
  };

  const checkSubmit = () => {
    return userInfo ? true : false;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (checkSubmit()) {
      sendPost().then(() => {
        linkPush("/notice");
      });
    } else {
      alert("Error occurred. Please check the form.");
    }
  };

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNoticeContent((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const onChangeValue = () => {
    setNoticeContent((prevState) => ({
      ...prevState,
      important: prevState.important ? 0 : 1,
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
                    value={noticeContent.title}
                    onChange={handleValueChange}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <textarea
                    className="form-control"
                    name="content"
                    placeholder="공지 내용"
                    value={noticeContent.content}
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
                    checked={Boolean(noticeContent.important)}
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
