"use client";

import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  VStack,
  HStack,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export const Footer: React.FC = () => (
  <Box bg="gray.50" color="gray.700" py={8}>
    <Container maxW="container.xl">
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={8}
        justify="space-between"
      >
        <VStack align={{ base: "center", md: "start" }} spacing={4}>
          <Text fontSize="lg" fontWeight="bold">
            학생문화공간위원회
          </Text>
          <Text textAlign={{ base: "center", md: "left" }} fontSize="sm">
            대전광역시 유성구 대학로 291
            <br />
            한국과학기술원 N13-1 장영신학생회관 309호
            <br />
            월,화,수 상근 19~21시 | 목요일 상근 21~23시
            <br />
            Tel: +82 042-350-0386
            <br />
            Email: scspace@kaist.ac.kr
          </Text>
        </VStack>

        <HStack spacing={12} justify={{ base: "center", md: "start" }}>
          <VStack align="start">
            <Text fontWeight="semibold">바로가기</Text>
            <Link as={NextLink} href="/">
              메인 페이지
            </Link>
            <Link as={NextLink} href="/introduction">
              공간위에 관해
            </Link>
            <Link as={NextLink} href="/reservation">
              예약하기
            </Link>
            <Link as={NextLink} href="/introduction">
              회칙 및 약관
            </Link>
          </VStack>

          <VStack align="start">
            <Text fontWeight="semibold">공간위 공간들</Text>
            <Link as={NextLink} href="/space/individual-practice-room">
              개인연습실
            </Link>
            <Link as={NextLink} href="/space/piano-room">
              피아노실
            </Link>
            <Link as={NextLink} href="/space/ullim-hall">
              울림홀
            </Link>
            <Link as={NextLink} href="/space/mirae-hall">
              미래홀
            </Link>
            <Link as={NextLink} href="/space/seminar-room">
              세미나실
            </Link>
            <Link as={NextLink} href="/space/open-space">
              오픈스페이스
            </Link>
            <Link as={NextLink} href="/space/group-practice-room">
              합주실
            </Link>
            <Link as={NextLink} href="/space/dance-studio">
              무예실
            </Link>
            <Link as={NextLink} href="/space/workshop">
              창작공방
            </Link>
          </VStack>
        </HStack>
      </Stack>

      <Divider my={6} />

      <Stack
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
      >
        <Text fontSize="sm">
          &copy; 2025 학생문화공간위원회. 원본 Herobiz (BootstrapMade 디자인
          변형)
        </Text>

        <HStack spacing={2}>
          <IconButton
            as="a"
            href="https://facebook.com/scspace.kaist"
            aria-label="Facebook"
            icon={<FaFacebook />}
          />
          <IconButton
            as="a"
            href="https://www.instagram.com/scspace_kaist/"
            aria-label="Instagram"
            icon={<FaInstagram />}
          />
        </HStack>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
