import React from "react";
// import AskManageList from "@scspace-client/Components/Ask/AskManageList";
import ReservationManageList from "@scspace-client/Components/Reservation/ReservationManageList";
import PasswordView from "../Password/PasswordView";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "../_commons/PageTemplete";

export default function Manage() {
  const { userInfo } = useAuth();
  if (!userInfo) return <div>로그인이 필요합니다.</div>;
  return (
    <div>Management</div>
  );
};