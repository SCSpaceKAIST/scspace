import React from "react";
import Link from "next/link";
import AskManageList from "@Components/Ask/AskManageList";
import ReservationManageList from "@Components/Reservation/ReservationManageList";

const Manage = () => {
  return (
    <div>
      <AskManageList />
      <ReservationManageList />
    </div>
  );
};

export default Manage;
