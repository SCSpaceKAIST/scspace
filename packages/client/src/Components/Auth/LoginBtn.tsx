import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";

export const LoginBtn: React.FC = () => {
  const { isLogined, userInfo, isSCS } = useLoginCheck();

  return (
    <>
      {isLogined ? (
        <Dropdown>
          <Dropdown.Toggle
            className="btn-getstarted scrollto"
            id="dropdown-basic"
          >
            {userInfo?.nameKr}님
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as={Link} href="/mypage" passHref legacyBehavior>
              Mypage
            </Dropdown.Item>
            {isSCS() ? (
              <Dropdown.Item as={Link} href="/manage" passHref legacyBehavior>
                Manage
              </Dropdown.Item>
            ) : null}
            <Dropdown.Divider />
            <Dropdown.Item as={Link} href="/logout" passHref legacyBehavior>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Link
          className="btn-getstarted scrollto"
          href="/login"
          passHref
          legacyBehavior
        >
          Login
        </Link>
      )}
    </>
  );
};
