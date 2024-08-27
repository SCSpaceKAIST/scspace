"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Rule: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>(
    "https://scspace-public.s3.ap-northeast-2.amazonaws.com/%5B%ED%95%99%EC%83%9D%EB%AC%B8%ED%99%94%EA%B3%B5%EA%B0%84%EC%9C%84%EC%9B%90%ED%9A%8C%5D+%ED%9A%8C%EC%B9%99.pdf"
  );
  const [fileTitle, setFileTitle] = useState<string>("학생문화공간위원회 회칙");
  const [info, setInfo] = useState([
    {
      which: "학생문화공간위원회 회칙",
      file: "https://scspace-public.s3.ap-northeast-2.amazonaws.com/%5B%ED%95%99%EC%83%9D%EB%AC%B8%ED%99%94%EA%B3%B5%EA%B0%84%EC%9C%84%EC%9B%90%ED%9A%8C%5D+%ED%9A%8C%EC%B9%99.pdf",
      title: "학생문화공간위원회 회칙",
      clicked: true,
    },
    {
      which: "학생문화공간위원회 통합 약관",
      file: "https://scspace-public.s3.ap-northeast-2.amazonaws.com/ToS.pdf",
      title: "학생문화공간위원회 통합 약관",
      clicked: false,
    },
    {
      which: "공간 운영 세칙",
      file: "https://scspace-public.s3.ap-northeast-2.amazonaws.com/%5B%ED%95%99%EC%83%9D%EB%AC%B8%ED%99%94%EA%B3%B5%EA%B0%84%EC%9C%84%EC%9B%90%ED%9A%8C%5D+%EA%B3%B5%EA%B0%84+%EC%9A%B4%EC%98%81+%EC%84%B8%EC%B9%99.pdf",
      title: "공간 운영 세칙",
      clicked: false,
    },
    //... 기타 항목들
  ]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onClickEvent = (idx: number) => {
    const updatedInfo = info.map((item, i) => ({
      ...item,
      clicked: i === idx,
    }));
    setInfo(updatedInfo);
    setFileName(updatedInfo[idx].file);
    setFileTitle(updatedInfo[idx].title);
  };

  return (
    <section id="contact" className="pdf contact">
      <div className="container">
        <div className="row gy-5 gx-lg-5">
          <div className="col-lg-4">
            <div className="info">
              <h3>회칙</h3>
              <p>
                학생문화공간위원회의 모든 사업은 아래
                <br />
                회칙/세칙을 중심으로 진행됩니다.
              </p>
              {info.map((contents, idx) => (
                <div className="info-item d-flex" key={idx}>
                  <div>
                    <p onClick={() => onClickEvent(idx)}>{contents.which}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-8">
            <form className="php-email-form">
              <h4>
                <b>{fileTitle}</b>
              </h4>
              <hr />
              <div className="container viewer img-fluid">
                <Document file={fileName} onLoadSuccess={onDocumentLoadSuccess}>
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page key={index} scale={1.2} pageNumber={index + 1} />
                  ))}
                </Document>
              </div>
              <div className="text-end">
                <a href={fileName} download>
                  <button type="button">다운받기</button>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rule;
