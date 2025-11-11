"use client"

import { Box, Heading, SimpleGrid, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import ComingSoonCard from "@scspace-client/Components/molecules/home/ComingSoonCard";

const previewCards = [
    {
        title: "캠퍼스 공간 이야기",
        description: "공간을 운영하는 학생들의 생생한 경험과 운영 팁을 모아 소개합니다.",
        status: "12월 공개 예정",
        palette: "blue" as const,
    },
    {
        title: "예약 꿀팁 모음",
        description: "희망 시간대를 잡기 위한 전략부터 준비물 체크리스트까지 한 번에 정리합니다.",
        status: "1월 공개 예정",
        palette: "teal" as const,
    },
    {
        title: "공간 사진 미리보기",
        description: "실제 이용 사진과 함께 각 공간의 분위기와 활용 사례를 미리 확인해 보세요.",
        status: "곧 업데이트",
        palette: "purple" as const,
    },
];

export default function ComingSoonSection() {
    const columns = useBreakpointValue({ base: 1, md: 2, xl: 3 }) ?? 1;

    return (
        <Box as="section" bg="white" color="gray.900" py={{ base: 16, md: 24 }} px={{ base: 6, md: 20 }}>
            <VStack maxW="6xl" mx="auto" align="flex-start" gap={{ base: 10, md: 14 }}>
                <VStack align="flex-start" gap={4}>
                    <Heading fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.03em">
                        곧 만나볼 게시물 미리보기
                    </Heading>
                    <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="3xl">
                        공간 이야기를 더욱 풍부하게 전할 새로운 콘텐츠가 준비 중입니다. 정식 공개 전 미리 분위기를 확인해 보세요.
                    </Text>
                </VStack>

                <SimpleGrid columns={columns} gap={{ base: 4, md: 6 }} width="100%">
                    {previewCards.map((card, index) => (
                        <ComingSoonCard key={card.title} {...card} index={index} />
                    ))}
                </SimpleGrid>
            </VStack>
        </Box>
    );
}
