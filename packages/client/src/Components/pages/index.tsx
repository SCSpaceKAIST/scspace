"use client"

import {
    Badge,
    Box,
    Card,
    Heading,
    SimpleGrid,
    Text,
    VStack,
    HStack,
    useBreakpointValue,
} from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { IRedirect, useRedirectStore } from "@scspace-client/Store/redirect";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function FeatureGrid({ links }: { links: IRedirect[] }) {
    const { linkPush } = useLinkPush();
    const visibleLinks = links.filter((link) => !link.invisible && !link.disabled);
    const columns = useBreakpointValue({ base: 1, md: 2, xl: 3 }) ?? 1;

    if (visibleLinks.length === 0) {
        return (
            <Text color="gray.500" fontSize="sm">
                준비된 기능이 없습니다.
            </Text>
        );
    }

    return (
        <SimpleGrid columns={columns} gap={{ base: 4, md: 6 }} width="100%">
            {visibleLinks.map((link, index) => (
                <MotionBox
                    key={link.href}
                    role="group"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                >
                    <Card.Root
                        height="full"
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor="gray.200"
                        bg="white"
                        shadow="md"
                        transition="all 0.2s ease"
                        _groupHover={{ borderColor: "blue.300", shadow: "xl" }}
                        cursor="pointer"
                        onClick={() => linkPush(link.href)}
                    >
                        <Card.Header pb={0}>
                            <Heading size="md" letterSpacing="-0.02em">
                                {link.label}
                            </Heading>
                        </Card.Header>
                        <Card.Body pt={4} pb={6} color="gray.600" fontSize="sm">
                            {link.helperText ?? "바로가기"}
                        </Card.Body>
                        <Card.Footer pt={0}>
                            <Text fontSize="xs" color="blue.500">
                                {link.href.replace(/^https?:\/\//, "")}
                            </Text>
                        </Card.Footer>
                    </Card.Root>
                </MotionBox>
            ))}
        </SimpleGrid>
    );
}

function ComingSoonPreview() {
    const columns = useBreakpointValue({ base: 1, md: 2, xl: 3 }) ?? 1;
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

    return (
        <SimpleGrid columns={columns} gap={{ base: 4, md: 6 }} width="100%">
            {previewCards.map((card, index) => (
                <MotionBox
                    key={card.title}
                    role="group"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                    <Card.Root
                        height="full"
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="gray.200"
                        bg="white"
                        shadow="lg"
                        overflow="hidden"
                        transition="all 0.25s ease"
                        _groupHover={{ borderColor: `${card.palette}.400`, shadow: "xl" }}
                    >
                        <Box height="3px" width="100%" bgGradient={`linear(to-r, ${card.palette}.400, ${card.palette}.200)`} />
                        <Card.Header display="flex" flexDirection="column" gap={3}>
                            <Badge alignSelf="flex-start" colorPalette={card.palette} variant="subtle">
                                COMING SOON
                            </Badge>
                            <Heading size="md" letterSpacing="-0.01em">
                                {card.title}
                            </Heading>
                        </Card.Header>
                        <Card.Body color="gray.600" fontSize="sm" lineHeight={1.6}>
                            {card.description}
                        </Card.Body>
                        <Card.Footer>
                            <HStack gap={2} color="gray.500" fontSize="xs">
                                <Badge colorPalette={card.palette} variant="solid" fontWeight="medium">
                                    준비중
                                </Badge>
                                <Text>{card.status}</Text>
                            </HStack>
                        </Card.Footer>
                    </Card.Root>
                </MotionBox>
            ))}
        </SimpleGrid>
    );
}

export default function Home() {
    const { links } = useRedirectStore();
    const heroGap = useBreakpointValue<number>({ base: 6, md: 8 }) ?? 6;
    const heroFontSize = useBreakpointValue({ base: "3xl", md: "5xl", lg: "6xl" });

    return (
        <Scroll>
            <VStack gap={0} align="stretch">
                <MotionBox
                    as="section"
                    minH="calc(100vh - 56px)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    bgGradient="linear(to-b, #ffffff, #f8fafc)"
                    color="black"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <VStack gap={heroGap} textAlign="center" px={{ base: 6, md: 0 }}>
                        <Heading
                            fontSize={heroFontSize}
                            fontWeight="extrabold"
                            letterSpacing="-0.05em"
                            lineHeight={1.1}
                        >
                            안녕하세요,
                            <br />
                            학생문화공간위원회 입니다.
                        </Heading>
                        <Text
                            fontSize={{ base: "md", md: "lg" }}
                            color="gray.600"
                            maxW="560px"
                        >
                            캠퍼스 공간이 필요한 순간, 예약부터 운영까지 간결하게 연결되는 플랫폼을 만들어갑니다.
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

                <Box
                    as="section"
                    minH="100vh"
                    bg="gray.50"
                    color="gray.900"
                    py={{ base: 16, md: 24 }}
                    px={{ base: 6, md: 20 }}
                >
                    <VStack maxW="6xl" mx="auto" align="flex-start" gap={{ base: 12, md: 16 }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Heading fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.03em">
                                필요한 기능들을 한눈에
                            </Heading>
                            <Text mt={4} fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="3xl">
                                예약 현황 확인, 공간 운영 지원, 안내와 알림까지. 학생문화공간위원회의 주요 서비스가 아래에 준비되어 있습니다.
                            </Text>
                        </MotionBox>

                        <FeatureGrid links={links} />
                    </VStack>
                </Box>

                <Box
                    as="section"
                    bg="white"
                    color="gray.900"
                    py={{ base: 16, md: 24 }}
                    px={{ base: 6, md: 20 }}
                >
                    <VStack maxW="6xl" mx="auto" align="flex-start" gap={{ base: 12, md: 16 }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Heading fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.03em">
                                곧 만나볼 게시물 미리보기
                            </Heading>
                            <Text mt={4} fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="3xl">
                                공간 이야기를 더욱 풍부하게 전할 새로운 콘텐츠가 준비 중입니다. 정식 공개 전 미리 분위기를 확인해 보세요.
                            </Text>
                        </MotionBox>

                        <ComingSoonPreview />
                    </VStack>
                </Box>

                <Box
                    as="section"
                    bg="gray.50"
                    color="gray.900"
                    py={{ base: 16, md: 24 }}
                    px={{ base: 6, md: 20 }}
                >
                    <VStack maxW="4xl" mx="auto" gap={{ base: 6, md: 10 }} textAlign="center">
                        <Heading fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em">
                            학생 모두를 위한 공간 경험을 만듭니다
                        </Heading>
                        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
                            위원회는 학생들이 더 쉽게 공간을 발견하고 예약할 수 있도록 서비스를 개선하고 있습니다. 앞으로도 더 다양한 기능을 통해 캠퍼스 생활을 돕겠습니다.
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Scroll>
    );
}
