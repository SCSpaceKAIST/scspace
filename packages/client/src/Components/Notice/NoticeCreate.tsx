"use client";

import { useEffect, useState } from "react";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";
import { INoticeCreate } from "@scspace-depot/types/notice";
import { useMutationApi } from "@scspace-client/Hooks/useApi";
import { noticeUrl } from "@scspace-depot/urls/notice";

const NoticeCreate: React.FC = () => {
  const { userInfo } = useLoginCheck();
  const { linkPush } = useLinkPush();
  const { mutateAsync: sendNoticeCreate } = useMutationApi(
    "/api/notice/create",
    "POST",
  );

  const [content, setContent] = useState<INoticeCreate>({
    title: "",
    content: "",
    important: false,
    userId: userInfo?.id ?? 0,
  });

  useEffect(() => {
    setContent({
      ...content,
      userId: userInfo?.id ?? 0,
    });
  }, [userInfo, content]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (content) {
      sendNoticeCreate(content).then(() => {
        linkPush(noticeUrl);
      });
    } else {
      alert("Error occurred. Please check the form.");
    }
  };

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setContent(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const onChangeValue = () => {
    setContent(prevState => ({
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
                    value={content.title}
                    onChange={handleValueChange}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <textarea
                    className="form-control"
                    name="content"
                    placeholder="공지 내용"
                    value={content.content}
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
                    checked={Boolean(content.important)}
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
