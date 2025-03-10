import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";
import { useLoginCheck } from "@scspace-client/Hooks/useLoginCheck";

export const LoginBtn: React.FC = () => {
  const { login, userInfo } = useLoginCheck();

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
