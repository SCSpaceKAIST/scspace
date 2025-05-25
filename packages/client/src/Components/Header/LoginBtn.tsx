"uce client"

import Link from "next/link";
import { useAuth } from "@scspace-client/Hooks/auth";
import { Button, Menu, Portal } from "@chakra-ui/react";
import { useLinkPush } from "@scspace-client/Hooks/api";

export const LoginBtn: React.FC = () => {
  const { isLogined, userInfo, } = useAuth();
  const { linkPush } = useLinkPush();

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
                  onClick={() => linkPush('/logout')}
                >
                  Logout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ) : (
        <Button variant="outline" rounded="sm" onClick={() => linkPush('/login')}>
          Login
        </Button>
      )}
    </>
  );
};
