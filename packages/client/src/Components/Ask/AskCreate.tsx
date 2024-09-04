"use client";

import { useState, useEffect } from "react";
import { useLoginCheck } from "@Hooks/useLoginCheck";
import { AskInputType } from "@depot/types/ask";
import { useLinkPush } from "@/Hooks/useLinkPush";
import { sendPost } from "@/Hooks/useApi";
import { askUrl } from "@depot/urls/ask";

const AskCreate: React.FC = () => {
  const { userInfo } = useLoginCheck();
  const { linkPush } = useLinkPush();
  const [content, setContent] = useState<AskInputType>({
    title: "",
    content: "",
    user_id: "",
  } as AskInputType);

  useEffect(() => {
    setContent({
      ...content,
      user_id: userInfo?.user_id ? userInfo?.user_id : "",
    });
  }, [userInfo]);

  const checkSubmit = () => {
    return userInfo ? true : false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkSubmit()) {
      //alert(JSON.stringify(content));
      sendPost(askUrl, content)
        .then((res) => {
          console.log(res.status);
          linkPush(askUrl);
        })
        .catch((err) => console.error(err));
    } else {
      alert("Error occurred. Please check the form.");
    }
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
