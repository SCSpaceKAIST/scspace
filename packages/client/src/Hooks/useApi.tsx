import { useState, useEffect } from "react";
import LoginCheck from "@Hooks/LoginCheck";
import { UserType } from "@depot/types/user";

export const useLoginCheck = () => {
  const [login, setLogin] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserType>();

  useEffect(() => {
    //userInfo 초기화
    LoginCheck().then((result) => {
      if (result !== false) {
        setUserInfo(result);
      } else {
        setUserInfo(undefined);
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

  return { login, withUserInfo, userInfo };
};
