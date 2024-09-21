import React from "react";
import AskManageList from "@Components/Ask/AskManageList";
import ReservationManageList from "@Components/Reservation/ReservationManageList";
import PasswordView from "../Password/PasswordView";
import { useLoginCheck } from "@/Hooks/useLoginCheck";

const Manage = () => {
  const { userInfo } = useLoginCheck();
  if (!userInfo) return <div>로그인이 필요합니다.</div>;
  return (
    <div>
      <PasswordView userInfo={userInfo} forManage={true} />
      <AskManageList />
      <ReservationManageList />
    </div>
  );
};

export default Manage;
