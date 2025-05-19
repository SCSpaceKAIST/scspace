"use client"

import {
  Box,
  Flex,
  Spacer,
  Image,
} from "@chakra-ui/react";
import { LoginBtn } from "./LoginBtn";

import DrawerComponent from "./Drawer";
import BreadcrumbComponent from "./Breadcrumb";

export default function Header() {
  return (
    <Box
      top={0}
      w="100%"
      bg="white"
      boxShadow="sm"
      zIndex={100}
    >
      <Flex
        px={4}
        py={2}
        gap={4}
        align="center"
      >
        <DrawerComponent />
        <BreadcrumbComponent />
        <Spacer />
        <Image
          src="/img/logo.svg"
          alt="LOGO"
          height={10}
          width={10}
          objectFit="contain"
        />
        <LoginBtn />
      </Flex>
    </Box>
  );
};
