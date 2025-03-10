"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import { VscEye } from "react-icons/vsc";
import { INotice } from "@scspace-depot/types/notice"; // INotice 타입 가져오기
import { useLoginCheck } from "@scspace-client/Hooks/useLoginCheck";
import { useLinkPush } from "@scspace-client/Hooks/useLinkPush";
import { noticeUrl } from "@scspace-depot/urls/notice";

interface NoticeViewProps {
  view_id: string;
}

const NoticeView: React.FC<NoticeViewProps> = ({ view_id }) => {
  const [content, setContent] = useState<INotice | null>(null);
  const { login, userInfo, isSCS } = useLoginCheck();
  const { linkPush } = useLinkPush();
  useEffect(() => {
    const fetchNotice = async () => {
      if (view_id && typeof window !== "undefined") {
        const res = await axios.get(`/api/notice/${view_id}`);
        setContent(res.data);
      }
    };
    fetchNotice();
  }, [view_id]);

  const callApiDelete = async () => {
    if (view_id) {
      await axios.get(`/api/notice/delete?id=${view_id}`);
      linkPush(noticeUrl);
    }
  };

  const editNotice = () => {};

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div id="main">
      <section className="blog">
        <div className="container">
          <div className="row g-5">
            <div>
              <article className="blog-details">
                <h2 className="title">{content.title}</h2>
                <div className="meta-top">
                  <ul>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-clock"></i>{" "}
                      <time>
                        {moment(content.timeEdit || content.timePost).format(
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
                <div className="content newline">
                  <p>{content.content}</p>
                </div>
                <div className="meta-bottom">
                  <i className="bi bi-folder"></i>
                  <ul className="cats">
                    <li>
                      <Link href={noticeUrl}>Notice</Link>
                    </li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </div>
        <br />
        <div className="container">
          {login && isSCS() && (
            <div className="text-end">
              <button
                type="button"
                className="modalButton2"
                onClick={editNotice}
              >
                수정
              </button>
              <button
                type="button"
                className="modalButton1"
                onClick={callApiDelete}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NoticeView;
