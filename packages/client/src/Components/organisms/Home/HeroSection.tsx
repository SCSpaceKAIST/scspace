"use client"

import { Badge, Box, Mark, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function HeroSection() {
    const heroGap = useBreakpointValue<number>({ base: 6, md: 8 }) ?? 6;
    const heroFontSize = useBreakpointValue({ base: "3xl", md: "5xl", lg: "6xl" });

    return (
        <MotionBox
            as="section"
            minH="calc(100dvh - 56px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            bgGradient="to-b"
            gradientFrom={"#ffffff"}
            gradientTo={"#f8fbff"}
            color="black"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <VStack gap={heroGap} textAlign="center" px={{ base: 6, md: 12 }}>
                <Badge
                    alignSelf="center"
                    borderRadius="full"
                    px={4}
                    py={1.5}
                    fontWeight="semibold"
                    colorPalette="blue"
                    variant="subtle"
                >
                    <Text fontWeight={"lighter"}>
                        <Mark fontWeight={"bold"}>S</Mark>tudent <Mark fontWeight={"bold"}>C</Mark>ulture & <Mark fontWeight={"bold"}>Space</Mark> Committee
                    </Text>
                </Badge>
                <VStack fontSize={heroFontSize} letterSpacing="-0.05em" lineHeight={1.1}>
                    <Text>안녕하세요,</Text>
                    <Text>
                        <Mark fontWeight="extrabold">학생문화공간위원회</Mark>입니다.
                    </Text>
                </VStack>
                <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
                    <Mark>KAIST 장영신학생회관과 미래홀 <Mark color="blue" fontWeight="semibold">공간 예약</Mark>부터,</Mark> <Mark>의자, 책상 등 <Mark color="blue" fontWeight="semibold"> 물품 대여</Mark>까지</Mark> <Mark>공간위의 모든 서비스를 한 곳에서 제공합니다.</Mark>
                </Text>
            </VStack>
            <MotionBox
                position="absolute"
                bottom={{ base: 12, md: 16 }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                color="gray.500"
                fontSize="sm"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
            >
                <Text>스크롤하여 더 알아보기</Text>
            </MotionBox>
        </MotionBox>
    );
}
