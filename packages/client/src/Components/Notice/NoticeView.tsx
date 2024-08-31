"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import { VscEye } from "react-icons/vsc";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { NoticeType } from "@depot/types/notice"; // NoticeType 타입 가져오기
import { useLoginCheck } from "@/Hooks/useLoginCheck";
import { useLinkPush } from "@/Hooks/useLinkPush";

interface NoticeViewProps {
  view_id: string;
}

const NoticeView: React.FC<NoticeViewProps> = ({ view_id }) => {
  const [content, setContent] = useState<NoticeType | null>(null);
  const { t } = useTranslation();
  const { login, userInfo } = useLoginCheck();
  const { linkPush } = useLinkPush();
  useEffect(() => {
    const fetchNotice = async () => {
      if (view_id) {
        const res = await axios.get(`/api/notice/${view_id}`);
        setContent(res.data);
      }
    };

    fetchNotice();
  }, []);

  const callApiDelete = async () => {
    if (view_id) {
      await axios.get(`/api/notice/delete?id=${view_id}`);
      linkPush("/notice");
    }
  };

  const editNotice = () => {
    // Notice 수정 구현
  };

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div id="main">
      <section className="blog">
        <div className="section-header">
          <h2>{t("공지사항")}</h2>
          <p>Notice</p>
          <hr />
        </div>
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
                        {moment(content.time_edit || content.time_post).format(
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
                      <Link href="/notice">Notice</Link>
                    </li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </div>
        <br />
        <div className="container">
          {login && userInfo?.type === "admin" && (
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
