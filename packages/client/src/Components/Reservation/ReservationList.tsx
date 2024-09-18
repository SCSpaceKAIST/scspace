"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReservationModal, { handleReservationSubmit } from "./ReservationModal";
import moment from "moment";
import { useBoardData } from "@/Hooks/useBoardData";
import {
  ReservationOutputType,
  ReservationType,
  reservationStateOptions,
  workerNeedOptions,
} from "@depot/types/reservation";
import { UserType } from "@depot/types/user";
import { useLoginCheck } from "@/Hooks/useLoginCheck";

const ReservationList: React.FC = () => {
  const { userInfo } = useLoginCheck();
  const {
    list,
    pageNumber,
    totalPageNumber,
    setPageNumber,
    boardDataRefreshBtnClick,
  } = useBoardData<ReservationOutputType>({
    apiEndpoint: `/api/reservation/user/${userInfo?.user_id}`,
    itemsPerPage: 10,
  });
  const [reservation, setReservation] = useState<ReservationType | null>(null);
  const [reserverInfo, setReserverInfo] = useState<UserType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = () => {
    if (!reservation || !userInfo) return;
    handleReservationSubmit(
      reservation,
      userInfo,
      setShowModal,
      boardDataRefreshBtnClick
    );
  };

  const handleReservationClick = (contents: ReservationOutputType) => {
    setReservation(contents);
    setReserverInfo(contents.userInfo);
    setShowModal(true);
  };

  return (
    <main id="main">
      <div className="container">
        <br />
        <h4>
          <b>나의 예약신청 목록</b>
        </h4>
        <hr />

        <table className="table manage">
          <thead>
            <tr>
              <th>공간</th>
              <th>예약 id</th>
              <th>시간</th>
              <th>예약한 시간</th>
              <th>상태</th>
              <th>근로 배정</th>
            </tr>
          </thead>
          <tbody>
            {list
              .slice((pageNumber - 1) * 10, pageNumber * 10)
              .map((contents: ReservationOutputType) => (
                <tr
                  key={contents.reservation_id}
                  onClick={() => handleReservationClick(contents)}
                >
                  <td>{contents.name}</td>
                  <td>{contents.reservation_id}</td>
                  <td>
                    {moment(contents.time_from).format("MM월 DD일 HH:mm")}~
                    {moment(contents.time_to).format("MM월 DD일 HH:mm")}
                  </td>
                  <td>
                    {moment(contents.time_post).format("YY년 MM월 DD일 HH:mm")}
                  </td>
                  <td>
                    <div className={contents.state} />
                    {reservationStateOptions[contents.state]}
                  </td>

                  <td>
                    <div className={contents.worker_need} />
                    {workerNeedOptions[contents.worker_need]}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="blog">
        <div className="blog-pagination">
          <ul className="justify-content-center">
            {Array.from({ length: totalPageNumber }, (_, i) => i + 1).map(
              (pageNum) => (
                <li
                  key={pageNum}
                  className={pageNumber === pageNum ? "active" : ""}
                  onClick={() => setPageNumber(pageNum)}
                >
                  <Link href="#">{pageNum}</Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <ReservationModal
        showHide={showModal}
        setShowHide={handleShowModal}
        reservationInfo={reservation}
        reserverInfo={reserverInfo}
        setReservationInfo={setReservation}
        handleSubmit={handleSubmit}
      />
    </main>
  );
};

export default ReservationList;
