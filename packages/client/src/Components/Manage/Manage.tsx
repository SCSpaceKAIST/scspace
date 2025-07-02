import React from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import { IPage } from "../PageSelector/PageSelector";
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
    <div>Management</div>
  );
};