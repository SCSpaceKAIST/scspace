"use client";

import React, { useState } from "react";
import Link from "next/link";
import Scspace from "./Scspace";
import Business from "./Business";
import Rule from "./Rule";

const Introduction: React.FC = () => {
  const [info, setInfo] = useState([
    { which: "소개", text: <Scspace />, clicked: true },
    { which: "사업소개", text: <Business />, clicked: false },
    { which: "회칙", text: <Rule />, clicked: false },
  ]);

  const onClickEvent = (idx: number) => {
    const copiedInfo = info.map((item, i) => ({
      ...item,
      clicked: i === idx,
    }));

    setInfo(copiedInfo);
  };

  return (
    <main id="main">
      <section>
        <div className="container">
          <div id="portfolio" className="portfolio">
            <div className="container-fluid">
              <ul className="portfolio-flters">
                {info.map((contents, idx) => (
                  <li key={idx} onClick={() => onClickEvent(idx)}>
                    {contents.which}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p>{info.find((contents) => contents.clicked)?.text}</p>
        </div>
      </section>
    </main>
  );
};

export default Introduction;
