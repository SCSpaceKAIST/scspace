"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useLinkPush } from "@/Hooks/useLinkPush";

interface AskCommentLeaveProps {
  view_id: string;
}

const AskCommentLeave: React.FC<AskCommentLeaveProps> = ({ view_id }) => {
  const [comment, setComment] = useState<string>("");
  const [dot, setDot] = useState<"wait" | "receive" | "solve">("wait");
  const { linkPush } = useLinkPush();
  const handleStates = {
    wait: "대기중",
    receive: "접수됨",
    solve: "해결됨",
  };

  useEffect(() => {
    callApi()
      .then((res) => {
        setComment(res.comment);
        setDot(res.state);
      })
      .catch((err) => console.log(err));
  }, [view_id]);

  const callApi = async () => {
    const res = await axios.get(`/api/ask/comment/id?id=${view_id}`);
    return res.data;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "comment") setComment(value);
    if (name === "dot") setDot(value as "wait" | "receive" | "solve");
  };

  const sendPost = async () => {
    const url = "/api/ask/comment/create";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post(url, JSON.stringify({ comment, dot, view_id }), config);
  };

  const checkSubmit = () => {
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checkSubmit()) {
      sendPost()
        .then(() => {
          linkPush("/ask");
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
            value={dot}
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
                value={comment}
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
