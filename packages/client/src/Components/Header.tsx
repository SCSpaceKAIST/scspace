"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LoginBtn } from "./Auth/LoginBtn";
import Image from "next/image";

interface MenuItem {
  name: string;
  sub_menu: string[];
  menu_link: string;
  sub_menu_link: string[];
}

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState<MenuItem[]>([
    { name: "공지사항", sub_menu: [], menu_link: "/notice", sub_menu_link: [] },
    {
      name: "소개",
      sub_menu: [],
      menu_link: "/introduction",
      sub_menu_link: [],
    },
    {
      name: "공간",
      sub_menu: [
        "개인연습실",
        "피아노실",
        "합주실",
        "무예실",
        "울림홀",
        "미래홀",
        "세미나실",
        "창작공방",
        "오픈스페이스",
      ],
      menu_link: "#",
      sub_menu_link: [
        "/space/individual-practice-room",
        "/space/piano-room",
        "/space/group-practice-room",
        "/space/dance-studio",
        "/space/ullim-hall",
        "/space/mirae-hall",
        "/space/seminar-room",
        "/space/workshop",
        "/space/open-space",
      ],
    },
    {
      name: "예약하기",
      sub_menu: ["예약하기", "예약 현황"],
      menu_link: "#",
      sub_menu_link: ["/reservation", "/calendar"],
    },
    {
      name: "예약 현황",
      sub_menu: ["예약하기", "예약 현황"],
      menu_link: "#",
      sub_menu_link: ["/reservation", "/calendar"],
    },
    {
      name: "문의",
      sub_menu: ["FAQ", "문의사항"],
      menu_link: "#",
      sub_menu_link: ["/faq", "/ask"],
    },
    { name: "이벤트", sub_menu: [], menu_link: "/event", sub_menu_link: [] },
  ]);

  const onClickEvent = () => {
    // 모바일 화면에서 탭 나오게 하는 부분
    document.querySelector("body")?.classList.toggle("mobile-nav-active");
    document.querySelector("#nav_menu")?.classList.toggle("bi-list");
    document.querySelector("#nav_menu")?.classList.toggle("bi-x");
  };

  const onClickEvent2 = (idx: number) => {
    // 모바일 화면에서 공간 예약 등 세부 링크나오게
    document.querySelector("#button" + idx)?.classList.toggle("bi-chevron-up");
    document
      .querySelector("#button" + idx)
      ?.classList.toggle("bi-chevron-down");
    document.querySelector("#ul" + idx)?.classList.toggle("dropdown-active");
  };

  return (
    <header id="header" className="header fixed-top" data-scrollto-offset="0">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <Link
          href="/"
          className="logo d-flex align-items-center scrollto me-auto me-lg-0"
        >
          <Image src="/img/logo.svg" width={40} height={40} alt="LOGO" />
          <h1>{}</h1>
        </Link>

        <nav id="navbar" className="navbar">
          <ul>
            {menu.map((menuItem, idx) => {
              return menuItem.sub_menu.length === 0 ? (
                <li key={idx}>
                  <Link className="nav-link scrollto" href={menuItem.menu_link}>
                    {t(menuItem.name)}
                  </Link>
                </li>
              ) : (
                <li
                  key={idx}
                  className="dropdown megamenu"
                  onClick={() => onClickEvent2(idx)}
                >
                  <Link href={menuItem.menu_link}>
                    <span>{t(menuItem.name)}</span>{" "}
                    <i
                      id={"button" + idx}
                      className="bi bi-chevron-down dropdown-indicator"
                    ></i>
                  </Link>
                  <ul id={"ul" + idx} className="">
                    <li>
                      {menuItem.sub_menu.map((sub_name, idx2) => {
                        return (
                          <Link key={idx2} href={menuItem.sub_menu_link[idx2]}>
                            {t(sub_name)}
                          </Link>
                        );
                      })}
                    </li>
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        <i
          id="nav_menu"
          className="bi bi-list mobile-nav-toggle d-none"
          onClick={onClickEvent}
        ></i>

        <LoginBtn></LoginBtn>
      </div>
    </header>
  );
};
