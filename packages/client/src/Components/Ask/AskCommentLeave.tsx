"use client";

import { useLinkPush } from "@/Hooks/useLinkPush";
import { AskStateEnum, AskType } from "@depot/types/ask";
import { sendPut } from "@/Hooks/useApi";
import { useEffect } from "react";
import { UserType } from "@depot/types/user";

interface AskCommentLeaveProps {
  content: AskType | null;
  setContent: React.Dispatch<React.SetStateAction<AskType | null>>;
  userInfo: UserType;
}

const AskCommentLeave: React.FC<AskCommentLeaveProps> = ({
  content,
  setContent,
  userInfo,
}) => {
  const { linkPush } = useLinkPush();

  useEffect(() => {
    if (userInfo)
      setContent({ ...content, commenter_id: userInfo.user_id } as AskType);
  }, [userInfo]);

  const setComment = (newComment: string) => {
    setContent((prevContent) => {
      if (prevContent === null) return null; // 현재 content가 없는 경우 null 반환
      return { ...prevContent, comment: newComment }; // 기존 content를 복사하고, comment만 새로운 값으로 업데이트
    });
  };

  const setState = (newState: AskStateEnum) => {
    setContent((prevContent) => {
      if (prevContent === null) return null; // 현재 state 없는 경우 null 반환
      return { ...prevContent, state: newState }; // 기존 content를 복사하고, state만 새로운 값으로 업데이트
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "comment") setComment(value);
    if (name === "dot") setState(value as AskStateEnum);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content) {
      sendPut("/ask/comment", content)
        .then(() => {
          alert("답변 완료");
          userInfo.type === "admin" ? linkPush("/manage") : linkPush("/ask");
        })
        .catch((err) => console.error(err));
    } else {
      alert("Submission failed."); // Add error message as needed
    }
  };

  return (
    <div className="comments">
      <div className="reply-form">
        <h4>답변을 남겨주세요.</h4>
        <form onSubmit={handleSubmit}>
          <select
            name="dot"
            value={content?.state}
            onChange={handleChange}
            className="ask-handle"
          >
            <option value="wait">대기중</option>
            <option value="receive">접수됨</option>
            <option value="solve">해결됨</option>
          </select>

          <div className="row">
            <div className="col form-group">
              <textarea
                name="comment"
                className="form-control"
                value={content?.comment}
                onChange={handleChange}
                placeholder="Your Comment"
              ></textarea>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskCommentLeave;
