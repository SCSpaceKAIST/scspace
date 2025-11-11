"use client"

import { Box, Heading, SimpleGrid, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import { useMemo } from "react";
import FeatureCard from "@scspace-client/Components/molecules/home/FeatureCard";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { IRedirect } from "@scspace-client/Store/redirect";

interface FeatureSectionProps {
    links: IRedirect[];
}

export default function FeatureSection({ links }: FeatureSectionProps) {
    const { linkPush } = useLinkPush();
    const columns = useBreakpointValue({ base: 1, md: 2, xl: 3 }) ?? 1;
    const visibleLinks = useMemo(() => links.filter((link) => !link.invisible && !link.disabled), [links]);

    return (
        <Box as="section" bg="white" color="gray.900" py={{ base: 16, md: 24 }} px={{ base: 6, md: 20 }}>
            <VStack maxW="6xl" mx="auto" align="flex-start" gap={{ base: 10, md: 14 }}>
                <VStack align="flex-start" gap={4}>
                    <Heading fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.03em">
                        지금 바로 이용할 수 있는 서비스
                    </Heading>
                    <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="3xl">
                        공간위가 제공하는 주요 기능을 한눈에 확인하고, 원하는 서비스로 빠르게 이동하세요.
                    </Text>
                </VStack>

                {visibleLinks.length === 0 ? (
                    <Text color="gray.500" fontSize="sm">
                        준비된 기능이 없습니다.
                    </Text>
                ) : (
                    <SimpleGrid columns={columns} gap={{ base: 4, md: 6 }} width="100%">
                        {visibleLinks.map((link, index) => (
                            <FeatureCard key={link.href} link={link} index={index} onSelect={linkPush} />
                        ))}
                    </SimpleGrid>
                )}
            </VStack>
        </Box>
    );
}
