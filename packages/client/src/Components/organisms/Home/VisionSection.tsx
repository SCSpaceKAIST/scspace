"use client"

import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export default function VisionSection() {
    return (
        <Box as="section" bg="gray.50" color="gray.900" py={{ base: 16, md: 24 }} px={{ base: 6, md: 20 }}>
            <VStack maxW="4xl" mx="auto" gap={{ base: 6, md: 10 }} textAlign="center">
                <Heading fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="-0.02em">
                    학생 모두를 위한 공간 경험을 만듭니다
                </Heading>
                <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
                    위원회는 학생들이 더 쉽게 공간을 발견하고 예약할 수 있도록 서비스를 개선하고 있습니다. 앞으로도 더 다양한 기능을 통해 캠퍼스 생활을 돕겠습니다.
                </Text>
            </VStack>
        </Box>
    );
}
