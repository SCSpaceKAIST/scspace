"use client";

import React, { useState } from "react";
import PageSelector, { IPage, } from "../PageSelector/PageSelector";

export default function Space() {
  const _spaces = [
    {
      href: "/space/individual-practice-room",
      helperText: "Individual Practice Room",
      label: "개인연습실"
    }, {
      href: "/space/piano-room",
      helperText: "Piano Room",
      label: "피아노실"
    },
    {
      href: "/space/ullim-hall",
      helperText: "Josumi Hall",
      label: "조수미홀",
    },
    {
      href: "/space/mirae-hall",
      helperText: "Mirae Hall",
      label: "미래홀"
    },
    {
      href: "/space/seminar-room",
      helperText: "Seminar Room",
      label: "세미나실"
    },
    {
      href: "/space/open-space",
      helperText: "Open Space",
      label: "오픈 스페이스"
    },
    {
      href: "/space/group-practice-room",
      helperText: "Ensemble Room",
      label: "합주실"
    },
    {
      href: "/space/dance-studio",
      helperText: "Dance Studio",
      label: "무예실"
    },
    {
      href: "/space/workshop",
      helperText: "Workshop",
      label: "창작공방",
    },
    {
      href: "/",
      helperText: "Busking Zone",
      label: "버스킹 존"
    }
  ];

  const spaces: IPage[] = _spaces.map((s, i) => {
    return {
      href: s.href,
      kor: s.label,
      eng: s.helperText,
      preview: (<div>{i + 1}</div>)
    }
  });

  return (
    <PageSelector
      pages={spaces}
    />
  );
};