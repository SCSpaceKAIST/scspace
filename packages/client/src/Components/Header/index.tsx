"use client"

import {
  Box,
  Flex,
  Spacer,
  Image,
  Text,
  HStack,
} from "@chakra-ui/react";
import { LoginBtn } from "./LoginBtn";

import DrawerComponent from "./Drawer";
import BreadcrumbComponent from "./Breadcrumb";
import ChangeLog from "./ChangeLog";

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
        gap={6}
        align="center"
      >
        <DrawerComponent />
        <BreadcrumbComponent />
        <Spacer />
        <ChangeLog />
        <HStack>
          <Text margin={0} padding={0} fontSize="xl" fontWeight="semibold" display={{ base: "none", md: "block" }}>
            학생문화공간위원회
          </Text>
          <Image
            src="/img/logo.svg"
            alt="LOGO"
            height={10}
            width={10}
            objectFit="contain"
          />
        </HStack>
        <LoginBtn />
      </Flex>
    </Box>
  );
};
