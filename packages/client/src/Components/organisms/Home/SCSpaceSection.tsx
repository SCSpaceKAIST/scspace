"use client"

import {
    Badge,
    Box,
    Card,
    ColorPicker,
    Heading,
    HStack,
    SimpleGrid,
    Text,
    VStack,
    parseColor,
    Stack,
    Mark,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import TeamCard, { TeamCardData } from "@scspace-client/Components/molecules/home/TeamCard";

const MotionBox = motion(Box);

const missionHighlights = [
    {
        title: "학생 주도 공간 운영",
        description: "장영신학생회관과 미래홀을 비롯한 학생 문화공간을 총괄 관리하며, 학생 주도의 운영 문화를 지켜갑니다.",
        palette: "blue" as const,
    },
    {
        title: "목소리를 담는 기획",
        description: "공간위는 학생들의 의견을 꾸준히 수렴하고 반영하여, 모두가 만족하는 공간 경험을 설계합니다.",
        palette: "teal" as const,
    },
    {
        title: "문화 생태계 확장",
        description: "다양한 문화 활동이 자연스럽게 이어질 수 있도록, 공간과 서비스를 지속적으로 고도화합니다.",
        palette: "purple" as const,
    },
];

const teams: TeamCardData[] = [
    {
        parent: "사업국",
        name: "회계팀",
        focus: "재정 관리",
        summary: "회계, 신학관 내부 재물 관리, 리크루팅 등",
        details: [
            "단체 운영을 위한 회계, 상근 관리, 자료 정리",
            "리크루팅과 내부 커뮤니케이션 프로그램 기획",
        ],
        palette: "blue",
    },
    {
        parent: "사업국",
        name: "디자인팀",
        focus: "브랜딩",
        summary: "디자인, 홍보 포스터 제작",
        details: [
            "공간 디자인과 단체 아이덴티티 자산 제작",
            "포스터, SNS 콘텐츠 등 학생 대상 커뮤니케이션",
        ],
        palette: "teal",
    },
    {
        parent: "관리국",
        name: "관리팀",
        focus: "공간 운영",
        summary: "공간위 산하 관리공간(장영신학생회관 및 미래홀) 관리",
        details: [
            "울림홀, 미래홀, 합주실 등 공간 예약과 이용 지원",
            "공연 집중 기간 추첨 운영으로 공정한 배정 유지",
        ],
        palette: "orange",
    },
    {
        parent: "개발국",
        name: "개발팀",
        focus: "사이트 관리",
        summary: "홈페이지 제작 및 내부 전산화",
        details: [
            "예약 시스템 설계와 서비스 경험 최적화",
            "반복 업무 자동화로 더 가치 있는 활동에 집중",
        ],
        palette: "purple",
    },
];

const ciColors = ["#7F7262", "#7B9EB6", "#221F19", "#D4DADD"];

export default function SCSpaceSection() {
    return (
        <Box
            as="section"
            bg={"#f8fbff"}
            color="gray.900"
            py={{ base: 18, md: 28 }}
            px={{ base: 6, md: 20 }}
        >
            <VStack maxW="7xl" mx="auto" align="stretch" gap={{ base: 14, md: 20 }}>
                <MotionBox
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6 }}
                >
                    <Stack gap={{ base: 10, lg: 16 }}>
                        <VStack align="flex-start" gap={6}>
                            <Heading fontSize={{ base: "xl", md: "3xl", sm: "2xl" }} lineHeight={"normal"}>
                                <Mark>KAIST 학생문화공간위원회는</Mark> <Mark whiteSpace={"nowrap"}>학생 문화의 <Mark color={"blue"}>현재</Mark>와 <Mark color={"blue"}>미래</Mark>를 설계합니다.</Mark>
                            </Heading>
                            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" lineHeight={1.7}>
                                공간위는 KAIST 학우들의 다양한 문화 활동을 지원하고, 모두가 공간을 필요에 맞게 활용할 수 있도록 운영과 기획에 힘을 쏟고 있습니다. 의견을 듣고 반영해 온 경험을 바탕으로, 앞으로도 학우들과 함께 문화의 스펙트럼을 넓혀 나가겠습니다.
                            </Text>
                            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} width="100%">
                                {missionHighlights.map((item) => (
                                    <Card.Root
                                        key={item.title}
                                        borderRadius="xl"
                                        borderWidth="1px"
                                        borderColor="gray.200"
                                        bg="white"
                                        shadow="sm"
                                        p={{ base: 5, md: 6 }}
                                    >
                                        <VStack align="flex-start" gap={3}>
                                            <Badge colorPalette={item.palette} variant="subtle" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="semibold">
                                                {item.title}
                                            </Badge>
                                            <Text color="gray.600" fontSize="sm" lineHeight={1.6}>
                                                {item.description}
                                            </Text>
                                        </VStack>
                                    </Card.Root>
                                ))}
                            </SimpleGrid>
                        </VStack>
                        <Card.Root
                            borderRadius="xl"
                            bgGradient="linear(to-br, blue.500, teal.400)"
                            shadow="md"
                            p={{ base: 8, md: 10 }}
                            display="flex"
                            alignItems="center"
                            size={"sm"}
                        >
                            <VStack align="flex-start" gap={6}>
                                <Heading size="2xl">
                                    함께 만드는 학생 문화 플랫폼
                                </Heading>
                                <Text fontSize="md" color="blue.950">
                                    공간위는 누구나 참여할 수 있는 열린 조직입니다. 새로운 아이디어와 손길을 기다리고 있어요.
                                </Text>
                                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} width="100%">
                                    <VStack align="flex-start" gap={1}>
                                        <Text fontSize="xl" fontWeight="bold">
                                            2008년부터
                                        </Text>
                                        <Text fontSize="sm" color="blue.900">
                                            학생 문화 공간을 설계하고 운영해 온 전통
                                        </Text>
                                    </VStack>
                                    <VStack align="flex-start" gap={1}>
                                        <Text fontSize="xl" fontWeight="bold">
                                            4개의 팀
                                        </Text>
                                        <Text fontSize="sm" color="blue.900">
                                            운영, 디자인, 관리, 개발이 함께합니다
                                        </Text>
                                    </VStack>
                                </SimpleGrid>
                            </VStack>
                        </Card.Root>
                    </Stack>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <VStack align="flex-start" gap={6}>
                        <HStack justify="space-between" width="100%" flexWrap="wrap" gap={4}>
                            <Heading fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}>
                                팀 소개
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                각 팀이 협업하며 공간 경험을 완성합니다.
                            </Text>
                        </HStack>
                        <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            gap={{ base: 5, lg: 6 }}
                            w={"full"}
                        >
                            {teams.map((team) => (
                                <TeamCard key={team.name} team={team} />
                            ))}
                        </SimpleGrid>
                    </VStack>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <VStack align="flex-start" gap={6}>
                        <HStack justify="space-between" width="100%" flexWrap="wrap" gap={4}>
                            <Heading fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}>
                                CI 소개
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                공간위를 나타내는 상징입니다.
                            </Text>
                        </HStack>
                        <Card.Root
                            borderRadius="2xl"
                            borderWidth="1px"
                            borderColor="gray.200"
                            bg="white"
                            shadow="lg"
                            p={{ base: 6, md: 10 }}
                        >
                            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} alignItems="center">
                                <VStack align="flex-start" gap={5}>
                                    <Heading size={{ md: "lg" }} letterSpacing="-0.02em">
                                        학생, 문화, 그리고 공간을 담은 아이덴티티
                                    </Heading>
                                    <Text color="gray.600" fontSize="sm" lineHeight={1.7}>
                                        학생문화공간위원회 CI는 푸른 청춘, 붉은 장영신학생회관, 그리고 깨끗한 푸른빛 백색을 담아 학생, 문화, 공간이라는 세 가지 가치를 하나로 묶었습니다. 장영신학생회관을 형상화한 <Mark fontWeight={"extrabold"}>ㄱㄱㅇ</Mark> 모양은 공간과 함께 성장해 온 공간위의 이야기를 전합니다.
                                    </Text>
                                </VStack>
                                <Stack direction={{ base: "column", xl: "row" }} gap={6} alignItems="center" w={"full"} justifyContent={"center"}>
                                    <Box position="relative" height="144px" width="180px">
                                        <Image fill style={{ objectFit: "contain" }} src="/img/logo.svg" alt="SCSpace logo" />
                                    </Box>
                                    <Stack justify="center" gap={4}>
                                        {ciColors.map((color) => (
                                            <ColorPicker.Root defaultValue={parseColor(color)} key={color} readOnly>
                                                <ColorPicker.Control>
                                                    <ColorPicker.ValueSwatch boxSize={5} />
                                                    <ColorPicker.ValueText whiteSpace={"nowrap"} />
                                                </ColorPicker.Control>
                                            </ColorPicker.Root>
                                        ))}
                                    </Stack>
                                </Stack>
                            </SimpleGrid>
                        </Card.Root>
                    </VStack>
                </MotionBox>
            </VStack>
        </Box>
    );
}
