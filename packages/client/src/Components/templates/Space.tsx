"use client";

import React, { useEffect, useState } from "react";
import PageSelector, { IPage, } from "../atoms/PageSelector";
import { useAllSpace } from "@scspace-client/Hooks/space";
import SpaceIntro from "../organisms/Space/SpaceIntro";

export default function Space() {
  const { spaces } = useAllSpace();
  const [spacePages, setSpacePages] = useState<IPage[]>([]);

  useEffect(() => {
    if (spaces) setSpacePages(
      spaces.map((s): IPage => {
        return {
          href: `/space/${s.id}`,
          kor: s.nameKr,
          eng: s.nameEn,
          preview: (<SpaceIntro space={s} />)
        }
      }));
  }, [spaces]);

  return (
    <PageSelector
      pages={spacePages}
    />
  );
};