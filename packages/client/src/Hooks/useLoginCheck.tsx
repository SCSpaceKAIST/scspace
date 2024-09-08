import { useState, useEffect } from "react";
import LoginCheck from "@Hooks/LoginCheck";
import { UserType, UserTypeEnum } from "@depot/types/user";
import { useLinkPush } from "./useLinkPush";

export const useLoginCheck = () => {
  const [login, setLogin] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserType | null | undefined>(
    undefined
  );
  const { linkPush } = useLinkPush();
  useEffect(() => {
    //userInfo 초기화
    LoginCheck().then((result) => {
      if (result !== false) {
        setUserInfo(result);
      } else {
        setUserInfo(null);
      }
    });
  }, []);

  useEffect(() => {
    //userInfo가 있냐 없냐에 따라 login을 세팅
    if (userInfo) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [userInfo]);

  const withUserInfo = (
    callback: (user: UserType) => JSX.Element
  ): JSX.Element => {
    if (userInfo) {
      return callback(userInfo); // login된 상태에만 콜백 함수를 호출
    }
    return <div />; // 로그인되지 않은 상태에서는 빈 div 반환
  };

  const needLogin = () => {
    if (userInfo === undefined) return;
    if (userInfo === null) {
      alert("로그인이 필요합니다." + JSON.stringify(userInfo));
      linkPush("/login");
    }
  };

  const needAdmin = () => {
    if (userInfo === undefined) return;
    needLogin();
    if (userInfo !== null && userInfo?.type !== "admin") {
      alert("관리자만 접근 가능한 페이지입니다.");
      linkPush("/");
    }
  };

  const ckLogin = () => {
    return login;
  };

  const ckAdmin = (type: UserTypeEnum) => {
    if (userInfo?.type === type) {
      return true;
    } else {
      return false;
    }
  };

  return {
    login,
    withUserInfo,
    userInfo,
    needLogin,
    needAdmin,
    ckLogin,
    ckAdmin,
  };
};
