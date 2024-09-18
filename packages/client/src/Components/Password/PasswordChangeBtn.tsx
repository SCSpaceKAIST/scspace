import React, { useState } from "react";
import axios from "axios"; // axios 사용

interface ChangePWProps {
  space: "GRP" | "WS"; // space는 'GRP' 또는 'WS'만 허용
}

const ChangePW: React.FC<ChangePWProps> = ({ space }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const sendPost_GRP = async () => {
    const url = "/api/etc/new_grp";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    return axios.post(url, JSON.stringify({}), config);
  };

  const sendPost_WS = async () => {
    const url = "/api/etc/new_ws";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    return axios.post(url, JSON.stringify({}), config);
  };

  const handleValue = () => {
    if (space === "GRP") {
      sendPost_GRP().then(() => setIsClicked(true));
    }
    if (space === "WS") {
      sendPost_WS().then(() => setIsClicked(true));
    }
  };

  const kor = (space: "GRP" | "WS") => {
    if (space === "GRP") return "합주실";
    if (space === "WS") return "창작공방";
  };

  return (
    <div>
      <div className="mid-align">
        <b>{isClicked ? "변경 완료!" : " "}</b>
      </div>
      <div className="changepw-button">
        <button onClick={handleValue}>{kor(space)} 비밀번호 변경</button>
      </div>
    </div>
  );
};

export default ChangePW;
