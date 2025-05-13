import { useState, useEffect } from "react";
import Link from "next/link";
import ReservationModal from "./ReservationModal";
import moment from "moment";
import { useBoardData } from "@scspace-client/Hooks/useBoardData";
import {
  IReservationResponse,
  reservationStateOptions,
  workerNeedOptions,
  reservationStateOptionsEng,
  workerNeedOptionsEng,
} from "@scspace-depot/types/reservation";
import { IUser } from "@scspace-depot/types/user";

const ReservationManageList: React.FC = () => {
  const {
    list,
    pageNumber,
    totalPageNumber,
    setPageNumber,
    boardDataRefreshBtnClick,
  } = useBoardData<IReservationResponse>({
    apiEndpoint: "/api/reservation/manage",
    itemsPerPage: 5,
    sortDesc: true,
  });
  const [reservation, setReservation] = useState<IReservationResponse | null>(
    null,
  );
  const [reserverInfo, setReserverInfo] = useState<IUser | null>(null);
  const [wait, setWait] = useState(0);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setWait(list.length);
  }, [list]);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleReservationClick = (contents: IReservationResponse) => {
    setReservation(contents);
    setReserverInfo(contents.user);
    setShowModal(true);
  };

  return (
    <main id="main">
      <div className="container">
        <br />
        <h4>
          <b>최신 예약신청 목록</b>
        </h4>
        <h6>
          <b>
            <Link href="/manage">{wait}개 대기중</Link>
          </b>
        </h6>
        <hr />

        <table className="table manage">
          <thead>
            <tr>
              <th>공간</th>
              <th>예약자</th>
              <th>예약 id</th>
              <th>시간</th>
              <th>예약한 시간</th>
              <th>상태</th>
              <th>근로 배정</th>
            </tr>
          </thead>
          <tbody>
            {list
              .slice((pageNumber - 1) * 5, pageNumber * 5)
              .map((contents: IReservationResponse) => (
                <tr
                  key={contents.id}
                  onClick={() => handleReservationClick(contents)}
                >
                  <td>{contents.space.name}</td>
                  <td>{contents.user.nameKr}</td>
                  <td>{contents.id}</td>
                  <td>
                    {moment(contents.timeFrom).format("MM월 DD일 HH:mm")}~
                    {moment(contents.timeTo).format("MM월 DD일 HH:mm")}
                  </td>
                  <td>
                    {moment(contents.timePost).format("YY년 MM월 DD일 HH:mm")}
                  </td>
                  <td>
                    <div
                      className={reservationStateOptionsEng[contents.state]}
                    />
                    {reservationStateOptions[contents.state]}
                  </td>

                  <td>
                    <div
                      className={workerNeedOptionsEng[contents.workerNeed]}
                    />
                    {workerNeedOptions[contents.workerNeed]}
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
              pageNum => (
                <li
                  key={pageNum}
                  className={pageNumber === pageNum ? "active" : ""}
                  onClick={() => setPageNumber(pageNum)}
                >
                  <Link href="#">{pageNum}</Link>
                </li>
              ),
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
        refresh={boardDataRefreshBtnClick}
      />
    </main>
  );
};

export default ReservationManageList;
