"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import { VscEye } from "react-icons/vsc";
import AskComment from "@Components/Ask/AskComment";
import { AskType } from "@depot/types/ask";
import AskCommentLeave from "@/Components/Ask/AskCommentLeave";
import { useLoginCheck } from "@/Hooks/useLoginCheck";

interface AskViewProps {
  view_id: string;
}

const ReservationView: React.FC<AskViewProps> = ({ view_id }) => {
  const [content, setContent] = useState<AskType | null>(null);

  const { login, userInfo } = useLoginCheck();
  const handle = { wait: "대기중", receive: "접수됨", solve: "해결됨" };

  useEffect(() => {
    if (view_id) {
      callApi(view_id)
        .then((res) => setContent(res))
        .catch((err) => console.log(err));
    }
  }, [view_id]);

  const callApi = async (id: string) => {
    const res = await axios.get(`/api/ask/${id}`);
    return res.data;
  };

  if (!content) return <div>Loading...</div>;

  return (
    <div id="main">
      <section className="blog">
        <div className="container">
          <h4>
            <b>문의사항</b>
          </h4>
          <hr />
          <div className="row g-5">
            <div>
              <article className="blog-details">
                <h2 className="title">{content.title}</h2>
                <div className="meta-top">
                  <ul>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-person"></i>
                      {content.user_id}
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-clock"></i>{" "}
                      <time>
                        {moment(content.time_post).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </time>
                    </li>
                    <li className="d-flex align-items-center">
                      <VscEye className="color-secondary-light" />
                      &nbsp;{content.views}
                    </li>
                  </ul>
                </div>
                <div className="content">
                  <div>{content.content}</div>
                </div>
                <div className="meta-bottom manage">
                  <div className="cats">
                    <div className={content.state} />
                    {handle[content.state]}
                  </div>
                </div>
              </article>
            </div>
          </div>
          {login && userInfo?.type === "admin" ? (
            <AskCommentLeave
              content={content}
              setContent={setContent}
              userInfo={userInfo}
            />
          ) : (
            <AskComment content={content} />
          )}
        </div>
      </section>
    </div>
  );
};

export default ReservationView;
