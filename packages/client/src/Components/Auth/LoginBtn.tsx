import Link from "next/link";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import LoginCheck from "@Components/Auth/LoginCheck";

interface UserInfo {
  name: string;
  type: "user" | "manager" | "admin" | "chief";
}

export const LoginBtn: React.FC = () => {
  const [login, setLogin] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    LoginCheck().then((result: any) => {
      if (result !== false) {
        setLogin(true);
        setUserInfo(result);
      } else {
        setLogin(false);
      }
    });
  }, []);
  return (
    <>
      {login ? (
        <Dropdown>
          <Dropdown.Toggle
            className="btn-getstarted scrollto"
            id="dropdown-basic"
          >
            {userInfo?.name}님
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as={Link} href="/mypage">
              Mypage
            </Dropdown.Item>
            {userInfo?.type === "admin" ? (
              <Dropdown.Item as={Link} href="/manage">
                Manage
              </Dropdown.Item>
            ) : null}
            <Dropdown.Divider />
            <Dropdown.Item as={Link} href="/logout">
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Link className="btn-getstarted scrollto" href="/login">
          Login
        </Link>
      )}
    </>
  );
};
