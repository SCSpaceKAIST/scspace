"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BsBuilding } from "react-icons/bs";
import { MdPeopleOutline, MdOutlineFestival } from "react-icons/md";
import { FaGuitar } from "react-icons/fa";
import Shinhak from "./Shinhak";
import Student from "./Student";
import Culture from "./Culture";
import Guitar from "./Guitar";

const Business: React.FC = () => {
  const [menu, setMenu] = useState<number>(0);

  const menulist = [
    <Shinhak key="shinhak" />,
    <Student key="student" />,
    <Culture key="culture" />,
    <Guitar key="guitar" />,
  ];
  const changeMenu = (menuIndex: number) => {
    document.querySelector(`#menu${menu}`)?.classList.toggle("active");
    document.querySelector(`#menu${menuIndex}`)?.classList.toggle("active");
    setMenu(menuIndex);
  };

  return (
    <section id="features" className="features">
      <div className="container">
        <div>
          <h5 className="business">
            학생문화공간위원회는 학생문화 증진을 위해 여러 가지 활동을 하고
            있습니다.
            <br />
            크게 3가지 분야로 나누어본다면 신학관 관리, 학생활동 지원, 문화사업
            기획이 있습니다.
            <br />
            공간관리와 학생활동 지원, 문화사업 기획 등의 능동적인 학생문화
            창출을 하며 카이스트 내에 올바른 학생문화가 정착할 수 있도록 하고
            있습니다.
          </h5>
          <div className="business-container">
            <ul className="nav nav-tabs row gy-4 d-flex">
              <li
                onClick={() => changeMenu(0)}
                className="nav-item col-6 col-md-4 col-lg-2 nav-link active show"
                id="menu0"
              >
                <BsBuilding size="30" className="color-cyan" />
                <h4>
                  신학관
                  <br />
                  관리
                </h4>
              </li>
              <li
                onClick={() => changeMenu(1)}
                className="nav-item col-6 col-md-4 col-lg-2 nav-link"
                id="menu1"
              >
                <MdPeopleOutline size="30" className="color-indigo" />
                <h4>
                  학생활동
                  <br />
                  지원
                </h4>
              </li>
              <li
                onClick={() => changeMenu(2)}
                className="nav-item col-6 col-md-4 col-lg-2 nav-link"
                id="menu2"
              >
                <MdOutlineFestival size="30" className="color-orange" />
                <h4>
                  문화사업
                  <br />
                  기획
                </h4>
              </li>
              <li
                onClick={() => changeMenu(3)}
                className="nav-item col-6 col-md-4 col-lg-2 nav-link"
                id="menu3"
              >
                <FaGuitar size="30" className="color-teal" />
                <h4>
                  기타
                  <br />
                  업무
                </h4>
              </li>
            </ul>
          </div>
        </div>

        <div className="tab-content">{menulist[menu]}</div>

        <br />

        <div className="text-end business">
          원하는 사업이 없다면
          <button>
            <Link href="/ask">문의하기</Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Business;
