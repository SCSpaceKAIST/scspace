"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LoginBtn } from "./Auth/LoginBtn";
import Image from "next/image";
import { noticeUrl } from "@depot/urls/notice";
import { askUrl } from "@depot/urls/ask";
import { SpaceTypeNames, SpaceTypesArray, SpaceType } from "@depot/types/space";
import { sendGet } from "@/Hooks/useApi";
import PasswordView from "@Components/Password/PasswordView";
import { useLoginCheck } from "@/Hooks/useLoginCheck";

interface MenuItem {
  name: string;
  sub_menu: string[];
  menu_link: string;
  sub_menu_link: string[];
}

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { userInfo } = useLoginCheck();
  const [menu, setMenu] = useState<MenuItem[]>([
    { name: "공지사항", sub_menu: [], menu_link: noticeUrl, sub_menu_link: [] },
    {
      name: "소개",
      sub_menu: [],
      menu_link: "/introduction",
      sub_menu_link: [],
    },
    {
      name: "공간",
      sub_menu: SpaceTypesArray.map((value, idx) => {
        return SpaceTypeNames[value];
      }),
      menu_link: "/space",
      sub_menu_link: SpaceTypesArray.map((value, idx) => {
        return `/${idx}`;
      }),
    },
    {
      name: "예약하기",
      sub_menu: SpaceTypesArray.map((value, idx) => {
        return SpaceTypeNames[value];
      }),
      menu_link: "/reservation",
      sub_menu_link: SpaceTypesArray.map((value, idx) => {
        return `/${idx}`;
      }),
    },
    {
      name: "예약 현황",
      sub_menu: SpaceTypesArray.map((value, idx) => {
        return SpaceTypeNames[value];
      }),
      menu_link: "/calendar",
      sub_menu_link: SpaceTypesArray.map((value, idx) => {
        return `/${idx}`;
      }),
    },
    {
      name: "문의",
      sub_menu: ["FAQ", "문의사항"],
      menu_link: "",
      sub_menu_link: ["/faq", askUrl],
    },
    { name: "이벤트", sub_menu: [], menu_link: "/event", sub_menu_link: [] },
  ]);

  useEffect(() => {
    sendGet<SpaceType[]>("/space/all").then((res) => {
      if (res) {
        setMenu([
          ...menu.slice(0, 3),
          {
            name: "예약하기",
            sub_menu: res.map((value, idx) => {
              return value.name;
            }),
            menu_link: "/reservation",
            sub_menu_link: res.map((value, idx) => {
              return `/${value.space_id}`;
            }),
          },
          {
            name: "예약 현황",
            sub_menu: res.map((value, idx) => {
              return value.name;
            }),
            menu_link: "/calendar",
            sub_menu_link: res.map((value, idx) => {
              return `/${value.space_id}`;
            }),
          },
          menu[5],
          menu[6],
        ]);
      }
    });
  }, []);

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
                          <Link
                            key={idx2}
                            href={
                              menuItem.menu_link + menuItem.sub_menu_link[idx2]
                            }
                          >
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
      {userInfo ? <PasswordView userInfo={userInfo} /> : <div />}
    </header>
  );
};
