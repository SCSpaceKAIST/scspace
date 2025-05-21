import React from "react";
// import AskManageList from "@scspace-client/Components/Ask/AskManageList";
import { useAuth } from "@scspace-client/Hooks/auth";

export default function Manage() {
  const { userInfo } = useAuth();
  if (!userInfo) return <div>로그인이 필요합니다.</div>;
  return (
    <div>Management</div>
  );
};