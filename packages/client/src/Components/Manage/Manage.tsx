"use client"

import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageSelector, { IPage } from "../PageSelector/PageSelector";
import ManageUser from "./ManageUser";

export default function Manage() {
  const { needManager } = useAuth();
  needManager();

  const pages: IPage[] = [
    {
      kor: "유저 관리",
      eng: "Manage user",
      preview: <ManageUser />,
      href: "/manage/user"
    }
  ]

  return (
    <PageSelector
      pages={pages}
    />
  );
};