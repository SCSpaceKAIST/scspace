"use client";

import {
  Box,
  Flex,
  Spacer,
  Link,
  IconButton,
  Image,
  useDisclosure,
  Stack,
  Collapsible,
} from "@chakra-ui/react";
import { Breadcrumb, Button } from "@chakra-ui/react";
import { Menu } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import { LoginBtn } from "./Auth/LoginBtn";
import { useEffect, useState } from "react";
import { useSpaces } from "@scspace-client/Apis/space/useSpaces";
import PasswordView from "@scspace-client/Components/Password/PasswordView";
import { usePathname } from "next/navigation";
import { HiXMark, HiOutlineBars3, HiOutlineChevronDown } from "react-icons/hi2";

interface MenuItemType {
  name: string;
  sub_menu: string[];
  menu_link: string;
  sub_menu_link: string[];
}

export const Header = () => {
  const { open, onToggle } = useDisclosure();
  const { userInfo } = useLoginCheck();
  const { spaceArray } = useSpaces();
  const pathname = usePathname();

  const [menu, setMenu] = useState<MenuItemType[]>([
    //{
    //name: "소개",
    //sub_menu: [],
    //menu_link: "/introduction",
    //sub_menu_link: [],
    //},
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
  ]);

  useEffect(() => {
    if (spaceArray) {
      setMenu([
        //menu[0],
        //menu[1],
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
        // menu[4],
      ]);
    }
  }, [spaceArray]);

  return (
    <Box
      position="fixed"
      top={0}
      w="100%"
      bg="white"
      // h
      boxShadow="sm"
      zIndex={100}
    >
      <Flex py={3} px={4} align="center">
        <Breadcrumb.Root variant="plain">
          <Breadcrumb.List margin={0} padding={0}>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">
                <Image
                  src="/img/logo.svg"
                  alt="LOGO"
                  width={12}
                  height={12}
                  objectFit="contain"
                />
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link as={Link} href={pathname}>
                <Button variant="outline" rounded="md">
                  {pathname.split('/')[1]}
                </Button>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>

        <Spacer />

        {/*
        <Flex display={{ base: "none", md: "flex" }} gap={4}>
          {menu.map((menuItem, idx) => {
            return (
              Menu.Root key={idx}>
                {menuItem.sub_menu.length > 0 ? (
                  <>
                    <Menu.Trigger>
                      
                    </Menu.Trigger>
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
              </Menu.Root>
            );
          })}
        </Flex>
        */}

        <Box ml={4}>
          <LoginBtn />
        </Box>

        <IconButton
          // aria-label="menu"
          display={{ base: "flex", md: "none" }}
          ml={2}
          onClick={onToggle}
        >
          {open ? <HiXMark /> : <HiOutlineBars3 />}
        </IconButton>
      </Flex>

      <Collapsible.Root open={open}>
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
      </Collapsible.Root>
      {userInfo && <PasswordView userInfo={userInfo} />}
    </Box>
  );
};
