import Link from "next/link";
import { useLoginCheck } from "@scspace-client/APIs/auth/useLoginCheck";
import { Button, Menu, Portal } from "@chakra-ui/react";

export const LoginBtn: React.FC = () => {
  const { isLogined, userInfo, isSCS } = useLoginCheck();

  return (
    <>
      {isLogined ? (
        <Menu.Root>
          <Menu.Trigger>
            <Button>
              {userInfo?.nameKr}님
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value={"test"}>
                  ??
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ) : (
        <Link href="/login" passHref>
          <Button variant="outline" rounded="sm">
            Login
          </Button>
        </Link>
      )}
    </>
  );
};
