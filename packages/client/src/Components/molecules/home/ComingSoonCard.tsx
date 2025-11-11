"use client"

import { Badge, Box, Card, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

export interface ComingSoonCardProps {
    title: string;
    description: string;
    status: string;
    palette: "blue" | "teal" | "purple" | "cyan" | "pink";
    index: number;
}

export default function ComingSoonCard({ title, description, status, palette, index }: ComingSoonCardProps) {
    return (
        <MotionDiv
            role="group"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
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
                _groupHover={{ borderColor: `${palette}.400`, shadow: "xl" }}
            >
                <Box height="3px" width="100%" bgGradient={`linear(to-r, ${palette}.400, ${palette}.200)`} />
                <VStack align="flex-start" gap={5} p={{ base: 6, md: 8 }} height="full">
                    <Badge alignSelf="flex-start" colorPalette={palette} variant="subtle">
                        COMING SOON
                    </Badge>
                    <Heading size="md" letterSpacing="-0.01em">
                        {title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" lineHeight={1.6}>
                        {description}
                    </Text>
                    <HStack gap={2} color="gray.500" fontSize="xs" fontWeight="medium" mt="auto">
                        <Badge colorPalette={palette} variant="solid">
                            준비 중
                        </Badge>
                        <Text>{status}</Text>
                    </HStack>
                </VStack>
            </Card.Root>
        </MotionDiv>
    );
}
