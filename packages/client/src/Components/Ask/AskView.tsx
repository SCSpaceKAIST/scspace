"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import { VscEye } from "react-icons/vsc";
import AskComment from "@Components/Ask/AskComment";
import { IAsk, askStateOptions, askStateOptionsEng } from "@depot/types/ask";
import AskCommentLeave from "@/Components/Ask/AskCommentLeave";
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { UserTypeEnum } from "@depot/enums/user.enum";

interface AskViewProps {
  view_id: string;
}

const AskView: React.FC<AskViewProps> = ({ view_id }) => {
  const [content, setContent] = useState<IAsk | null>(null);

  const { login, userInfo } = useLoginCheck();

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
                      {content.userId}
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-clock"></i>{" "}
                      <time>
                        {moment(content.timePost).format(
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
                    <div className={askStateOptionsEng[content.state]} />
                    {askStateOptions[content.state]}
                  </div>
                </div>
              </article>
            </div>
          </div>
          {login && userInfo?.type === UserTypeEnum.ADMIN ? (
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

export default AskView;
