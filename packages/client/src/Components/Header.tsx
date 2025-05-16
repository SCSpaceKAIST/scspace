"use client";

import {
  Box,
  Flex,
  Spacer,
  Link,
  IconButton,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { Breadcrumb, Button } from "@chakra-ui/react";
// import { Menu } from "@chakra-ui/react";
// import NextLink from "next/link";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import { LoginBtn } from "./Auth/LoginBtn";
import { useEffect, useState } from "react";
import { useSpaces } from "@scspace-client/Apis/space/useSpaces";
// import PasswordView from "@scspace-client/Components/Password/PasswordView";
import { usePathname } from "next/navigation";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Fragment } from "react";
import {
  CloseButton,
  Drawer,
  Portal,
  Separator,
  List
} from "@chakra-ui/react"
import { VStack, HStack, Text } from "@chakra-ui/react";
import { FaInstagram } from "react-icons/fa";

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

  const paths = pathname.split('/');
  let temp = "";
  const pathnames = paths.filter((p) => p).map((path, idx) => {
    temp += "/" + path;
    return {
      href: temp,
      value: path,
      isFinal: (paths.length === idx + 2),
    };
  });

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
      <Flex
        px={4}
        py={2}
        gap={4}
        align="center"
      >
        <Drawer.Root
          placement="start"
          size="sm"
        >
          <Drawer.Trigger asChild>
            <IconButton
              variant="outline"
              rounded="md"
            >
              <HiOutlineBars3 />
            </IconButton>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>
                    학생문화공간위원회
                    <Text
                      fontSize="lg"
                      color="gray.500"
                      margin={0}
                    >
                      Student Curture & Space Commitee
                    </Text>
                  </Drawer.Title>
                </Drawer.Header>
                <Separator />
                <Drawer.Body>
                  <List.Root>
                    <List.Item>
                      <Link as={Link} href="/introduction">
                        about SCSpace
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link as={Link} href="/reservation">
                        Reservation
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link as={Link} href="/introduction">
                        link 3
                      </Link>
                    </List.Item>
                  </List.Root>
                  <Separator />
                  <VStack align="start">
                    <Text fontWeight="semibold">공간위 공간들</Text>
                    <Link as={Link} href="/space/individual-practice-room">
                      개인연습실
                    </Link>
                    <Link as={Link} href="/space/piano-room">
                      피아노실
                    </Link>
                    <Link as={Link} href="/space/ullim-hall">
                      울림홀
                    </Link>
                    <Link as={Link} href="/space/mirae-hall">
                      미래홀
                    </Link>
                    <Link as={Link} href="/space/seminar-room">
                      세미나실
                    </Link>
                    <Link as={Link} href="/space/open-space">
                      오픈스페이스
                    </Link>
                    <Link as={Link} href="/space/group-practice-room">
                      합주실
                    </Link>
                    <Link as={Link} href="/space/dance-studio">
                      무예실
                    </Link>
                    <Link as={Link} href="/space/workshop">
                      창작공방
                    </Link>
                  </VStack>
                </Drawer.Body>
                <Drawer.Footer
                  bg="gray.50"
                  color="gray.700"
                >
                  <VStack
                    align="start"
                    width="100%"
                    pt={4}
                  >
                    <HStack
                      width="100%"
                      justify="space-between"
                    >
                      <Text fontSize="lg" fontWeight="bold">
                        학생문화공간위원회(딴거넣고싶은데)
                      </Text>

                      <HStack>
                        <Link href="https://www.instagram.com/scspace_kaist/">
                          <IconButton
                            aria-label="Instagram"
                            variant="outline"
                            rounded="md"
                            size="xs"
                          >
                            <FaInstagram />
                          </IconButton>
                        </Link>
                      </HStack>
                    </HStack>
                    <List.Root>
                      <List.Item>
                        대전광역시 유성구 대학로 291
                      </List.Item>
                      <List.Item>
                        한국과학기술원 N13-1 장영신학생회관 309호
                      </List.Item>
                      <List.Item>
                        월, 화, 수 상근 19 - 21시 | 목요일 상근 21 - 23시
                      </List.Item>
                      <List.Item>
                        Email: scspace@kaist.ac.kr
                      </List.Item>
                    </List.Root>
                  </VStack>
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
        <Breadcrumb.Root variant="plain">
          <Breadcrumb.List margin={0} padding={0}>
            <Breadcrumb.Item>
              <Breadcrumb.Link
                as={Link}
                href="/"
                textDecoration="none"
              >
                <Button variant="outline" rounded="md">
                  Home
                </Button>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            {pathnames.map((pn) => (
              <Fragment key={pn.href}>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link
                    as={Link}
                    href={pn.href}
                    textDecoration="none"
                  >
                    <Button
                      variant={pn.isFinal ? "solid" : "outline"}
                      rounded="md"
                    >
                      {pn.value}
                    </Button>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Fragment>
            ))}
          </Breadcrumb.List>
        </Breadcrumb.Root>

        <Spacer />
        <Image
          src="/img/logo.svg"
          alt="LOGO"
          height={10}
          width={10}
          objectFit="contain"
        />

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

        <LoginBtn />

      </Flex>

      {/*
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
      */}
    </Box>
  );
};
