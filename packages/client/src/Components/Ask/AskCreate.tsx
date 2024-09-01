"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useLoginCheck } from "@Hooks/useLoginCheck";

const CreateAsk: React.FC = () => {
  const [state, setState] = useState<{ [key: string]: any }>({});
  const router = useRouter();

  const { needLogin } = useLoginCheck();
  needLogin();

  const sendPost = () => {
    const url = "/api/ask/create";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    return axios.post(url, JSON.stringify(state), config);
  };

  const checkSubmit = () => {
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkSubmit()) {
      sendPost()
        .then((res) => {
          console.log(res.data);
          router.push("/ask");
        })
        .catch((err) => console.error(err));
    } else {
      alert("Error occurred. Please check the form.");
    }
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div id="main">
      <div className="breadcrumbs">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h3>문의</h3>
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/ask">문의</Link>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <section>
        <div className="section-header">
          <h2>문의하기</h2>
          <p>Ask</p>
        </div>
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
      </section>
    </div>
  );
};

export default CreateAsk;
