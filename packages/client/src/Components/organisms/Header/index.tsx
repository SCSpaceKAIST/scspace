"use client"

import {
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import LoginBtn from "@scspace-client/Components/organisms/Header/LoginBtn";
import BreadcrumbComponent from "@scspace-client/Components/organisms/Header/Breadcrumb";
import Sidebar from "@scspace-client/Components/organisms/Header/Sidebar";
import { useRedirects } from "@scspace-client/Store/redirect/reset";
import LanguageSetup from "./LanguageSetup";

export default function Header() {
  useRedirects();

  return (
    <Box
      top={0}
      w="100%"
      bg="white"
      boxShadow="sm"
      zIndex={100}
      h={"56px"}
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
        <LanguageSetup />
        <LoginBtn />
      </Flex>
    </Box>
  );
};
