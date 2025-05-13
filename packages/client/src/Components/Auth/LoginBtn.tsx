import Link from "next/link";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import { ChevronDownIcon } from "@chakra-ui/icons"; // 아이콘 임포트
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"; // 필요한 Chakra UI 컴포넌트 임포트

export const LoginBtn: React.FC = () => {
  const { isLogined, userInfo, isSCS } = useLoginCheck();

  return (
    <>
      {isLogined ? (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {userInfo?.nameKr}님
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} href="/mypage" passHref>
              Mypage
            </MenuItem>
            {isSCS() ? (
              <MenuItem as={Link} href="/manage" passHref>
                Manage
              </MenuItem>
            ) : null}
            <MenuItem as={Link} href="/logout" passHref>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Link href="/login" passHref>
          <Button className="btn-getstarted scrollto">Login</Button>
        </Link>
      )}
    </>
  );
};
