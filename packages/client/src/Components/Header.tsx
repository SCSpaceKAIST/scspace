"use client";

import {
  Box,
  Flex,
  Spacer,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Image,
  useDisclosure,
  Stack,
  Collapse,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { HamburgerIcon, ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import { LoginBtn } from "./Auth/LoginBtn";
import { useEffect, useState } from "react";
import { useSpaces } from "@scspace-client/Apis/space/useSpaces";
import PasswordView from "@scspace-client/Components/Password/PasswordView";

interface MenuItemType {
  name: string;
  sub_menu: string[];
  menu_link: string;
  sub_menu_link: string[];
}

export const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { userInfo } = useLoginCheck();
  const { spaceArray } = useSpaces();

  const [menu, setMenu] = useState<MenuItemType[]>([
    { name: "공지사항", sub_menu: [], menu_link: "/notice", sub_menu_link: [] },
    {
      name: "소개",
      sub_menu: [],
      menu_link: "/introduction",
      sub_menu_link: [],
    },
    {
      name: "예약하기",
      sub_menu: [],
      menu_link: "/reservation",
      sub_menu_link: [],
    },
    {
      name: "예약 현황",
      sub_menu: [],
      menu_link: "/calendar",
      sub_menu_link: [],
    },
    {
      name: "문의",
      sub_menu: ["FAQ", "문의사항"],
      menu_link: "",
      sub_menu_link: ["/faq", "/ask"],
    },
  ]);

  useEffect(() => {
    if (spaceArray) {
      setMenu([
        menu[0],
        menu[1],
        {
          name: "예약하기",
          sub_menu: spaceArray.map(value => value.name),
          menu_link: "/reservation",
          sub_menu_link: spaceArray.map(value => `/${value.id}`),
        },
        {
          name: "예약 현황",
          sub_menu: spaceArray.map(value => value.name),
          menu_link: "/calendar",
          sub_menu_link: spaceArray.map(value => `/${value.id}`),
        },
        menu[4],
      ]);
    }
  }, [spaceArray]);

  return (
    <Box
      position="fixed"
      top={0}
      w="100%"
      bg="white"
      boxShadow="sm"
      zIndex={100}
    >
      <Flex py={3} px={4} align="center">
        <Link as={NextLink} href="/">
          <Image src="/img/logo.svg" alt="LOGO" width={10} height={10} />
        </Link>
        <Spacer />

        <Flex display={{ base: "none", md: "flex" }} gap={4}>
          {menu.map((menuItem, idx) => (
            <Menu key={idx}>
              {menuItem.sub_menu.length > 0 ? (
                <>
                  <MenuButton as={Link}>
                    {menuItem.name}
                    <ChevronDownIcon />
                  </MenuButton>
                  <MenuList>
                    {menuItem.sub_menu.map((sub, subIdx) => (
                      <MenuItem
                        as={NextLink}
                        href={`${menuItem.menu_link}${menuItem.sub_menu_link[subIdx]}`}
                        key={subIdx}
                      >
                        {sub}
                      </MenuItem>
                    ))}
                  </MenuList>
                </>
              ) : (
                <Link as={NextLink} href={menuItem.menu_link}>
                  {menuItem.name}
                </Link>
              )}
            </Menu>
          ))}
        </Flex>

        <Box ml={4}>
          <LoginBtn />
        </Box>

        <IconButton
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="menu"
          display={{ base: "flex", md: "none" }}
          ml={2}
          onClick={onToggle}
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack bg="gray.50" px={4} py={4} spacing={3} display={{ md: "none" }}>
          {menu.map((menuItem, idx) => (
            <Box key={idx}>
              <Link as={NextLink} href={menuItem.menu_link}>
                {menuItem.name}
              </Link>
              <Stack pl={4}>
                {menuItem.sub_menu.map((sub, subIdx) => (
                  <Link
                    key={subIdx}
                    as={NextLink}
                    href={`${menuItem.menu_link}${menuItem.sub_menu_link[subIdx]}`}
                  >
                    {sub}
                  </Link>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Collapse>
      {userInfo && <PasswordView userInfo={userInfo} />}
    </Box>
  );
};
