"use client";

import { useState, useEffect } from "react";
import { useLoginCheck } from "@scspace-client/Hooks/useLoginCheck";
import { IAskCreate } from "@scspace-depot/types/ask";
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";
import { sendPost } from "@scspace-client/Hooks/useApi";
import { askUrl } from "@scspace-depot/urls/ask";

const AskCreate: React.FC = () => {
  const { userInfo } = useLoginCheck();
  const { linkPush } = useLinkPush();
  const [content, setContent] = useState<IAskCreate>({
    title: "",
    content: "",
    userId: userInfo?.id ?? 0,
  } as IAskCreate);

  useEffect(() => {
    setContent({
      ...content,
      userId: userInfo?.id ?? 1,
    });
  }, [userInfo, content]);

  // 제출 가능한 상태인지 확인
  const checkSubmit = () => {
    return !userInfo
      ? false
      : content.title.length === 0 || content.content.length === 0
        ? false
        : true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //if (checkSubmit()) {
      sendPost<boolean>(askUrl, content)
        .then((res) => {
          console.log(res);
          linkPush(askUrl);
        })
        .catch((err) => console.error(err));
    // } else {
    //   alert("Error occurred. Please check the form.");
    // }
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent({
      ...content,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div id="main">
      <hr />
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
                    onChange={handleValueChange}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <textarea
                    className="form-control"
                    name="content"
                    placeholder="문의 내용"
                    onChange={handleValueChange}
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <button type="submit">제출</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AskCreate;
