import Link from "next/link";
import { useAuth } from "@scspace-client/Hooks/auth";
import { Button, Menu, Portal } from "@chakra-ui/react";

export const LoginBtn: React.FC = () => {
  const { isLogined, userInfo, isSCS } = useAuth();

  return (
    <>
      {isLogined ? (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant="outline"
              rounded="sm"
            >
              {userInfo?.nameKr}님
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  value="logout"
                  color="fg.error"
                  _hover={{ bg: "bg.error", color: "fg.error" }}
                >
                  Logout
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
