"use client"

import {
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import LoginBtn from "@scspace-client/Components/organisms/Header/LoginBtn";
import BreadcrumbComponent from "@scspace-client/Components/organisms/Header/Breadcrumb";
import Information from "@scspace-client/Components/organisms/Header/Information";
import Sidebar from "@scspace-client/Components/organisms/Header/Sidebar";


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
        <Sidebar />
        <BreadcrumbComponent />
        <Spacer />
        <Information />
        <LoginBtn />
      </Flex>
    </Box>
  );
};
