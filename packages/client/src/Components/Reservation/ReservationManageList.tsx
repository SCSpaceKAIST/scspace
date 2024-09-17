import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import ReservModal from "./ReserveModal";
import moment from "moment";

const LatestReserve: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [list, setList] = useState([]);
  const [showHide, setShowHide] = useState(false);
  const [wait, setWait] = useState(0);
  const [reservation, setReservation] = useState(null);
  const [totalPageNumber, setTotalPageNumber] = useState(0);
  const [reserverInfo, setReserverInfo] = useState(null);
  const router = useRouter();

  const handle = { wait: "대기중", grant: "승인", rejected: "거절" };
  const workHandle = {
    nowork: "필요 없음",
    notassigned: "근로 필요",
    assigned: "근로 배정됨",
  };
  const spaceDict = {
    "individual-practice-room1": "개인연습실 1",
    "individual-practice-room2": "개인연습실 2",
    "individual-practice-room3": "개인연습실 3",
    "piano-room1": "피아노실 1",
    "piano-room2": "피아노실 2",
    "group-practice-room": "합주실",
    "dance-studio": "무예실",
    "ullim-hall": "울림홀",
    "mirae-hall": "미래홀",
    "seminar-room1": "세미나실 1",
    "seminar-room2": "세미나실 2",
    workshop: "창작공방",
    "open-space": "오픈스페이스",
  };

  useEffect(() => {
    const callApi = async () => {
      try {
        const res = await axios.get("/api/reservation/latest");
        setList(res.data);
        setWait(res.data.length);
        setTotalPageNumber(Math.ceil(res.data.length / 5));
      } catch (err) {
        console.error(err);
      }
    };

    callApi();
  }, []);

  const handleModalShowHide = () => {
    setShowHide(!showHide);
  };

  const callApiUser = async (id: string) => {
    try {
      const res = await axios.get(`/api/users/id?id=${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const setInfo = async (contents: any) => {
    try {
      const res = await callApiUser(contents.reserver_id);
      setReservation(contents);
      setReserverInfo(res);
      setShowHide(true);
    } catch (err) {
      console.error(err);
    }
  };

  const workStateChange = (work: any) => {
    if (work === null || work === undefined) return "nowork";
    if (work === false) return "notassigned";
    return "assigned";
  };

  const workStateChangeInverse = (work: string) => {
    if (work === "nowork") return null;
    if (work === "notassigned") return false;
    if (work === "assigned") return true;
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setReservation((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleValueChangeWork = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReservation((prev) => ({
      ...prev,
      content: {
        ...prev?.content,
        [e.target.name]: workStateChangeInverse(e.target.value),
      },
    }));
  };

  const sendPost = async () => {
    const url = "/api/reservation/comment/create";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.post(url, JSON.stringify(reservation), config);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checkSubmit()) {
      sendPost().then(() => {
        setShowHide(false);
      });
    } else {
      alert("Error: Please check the input.");
    }
  };

  const checkSubmit = () => {
    return true;
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
            <Link href="./manage/reservation">{wait}개 대기중</Link>
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
              .map((contents: any) => (
                <tr key={contents.id} onClick={() => setInfo(contents)}>
                  <td>{spaceDict[contents.space]}</td>
                  <td>{contents.reserver_id}</td>
                  <td>{contents.id}</td>
                  <td>
                    {moment(contents.time_from).format("MM월 DD일 HH:mm")}~
                    {moment(contents.time_to).format("MM월 DD일 HH:mm")}
                  </td>
                  <td>
                    {moment(contents.time_request).format("MM월 DD일 HH:mm")}
                  </td>
                  <td>
                    <div className={contents.state} />
                    {handle[contents.state]}
                  </td>
                  {contents.content === null ? (
                    <td>
                      <div className="nowork" />
                      근로 없음
                    </td>
                  ) : (
                    <td>
                      <div
                        className={workStateChange(
                          contents.content.workComplete
                        )}
                      />
                      {
                        workHandle[
                          workStateChange(contents.content.workComplete)
                        ]
                      }
                    </td>
                  )}
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

      <ReservModal
        modal={{ showHide, reservation }}
        onClickHandler={handleModalShowHide}
        handleSubmit={handleSubmit}
        onChangeHandler2={handleValueChange}
        onChangeHandler3={handleValueChangeWork}
      />
    </main>
  );
};

export default LatestReserve;
