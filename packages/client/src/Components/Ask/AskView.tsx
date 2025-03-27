"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import { VscEye } from "react-icons/vsc";
import AskComment from "@scspace-client/Components/Ask/AskComment";
import {
  IAsk,
  askStateOptions,
  askStateOptionsEng,
} from "@scspace-depot/types/ask";
import AskCommentLeave from "@scspace-client/Components/Ask/AskCommentLeave";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";
import { useQueryApi } from "@scspace-client/Hooks/useApi";

interface AskViewProps {
  view_id: string;
}

const AskView: React.FC<AskViewProps> = ({ view_id }) => {
  const { isLogined, userInfo } = useLoginCheck();

  const { data: content, isLoading } = useQueryApi<IAsk>(`/ask/${view_id}`);

  if (isLoading || !content) return <div>Loading...</div>;
  else
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
                            "YYYY-MM-DD HH:mm:ss",
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
            {isLogined && userInfo?.type === UserTypeEnum.ADMIN ? (
              <AskCommentLeave
                content={content}
                setContent={() => {}}
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
