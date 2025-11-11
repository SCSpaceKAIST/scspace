"use client"

import { Badge, Card, Heading, Separator, Text, VStack } from "@chakra-ui/react";

export interface TeamCardData {
    name: string;
    focus: string;
    summary: string;
    details: string[];
    palette: "blue" | "teal" | "orange" | "cyan" | "purple";
}

interface TeamCardProps {
    team: TeamCardData;
}

export default function TeamCard({ team }: TeamCardProps) {
    const { name, focus, summary, details, palette } = team;

    return (
        <Card.Root
            height="full"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="gray.200"
            bg="white"
            shadow="md"
            p={{ base: 5, md: 6 }}
            display="flex"
            w={"full"}
        >
            <VStack align="flex-start" gap={4} height="full">
                <Badge colorPalette={palette} variant="subtle" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="semibold">
                    {focus}
                </Badge>
                <Heading size="sm" letterSpacing="-0.01em">
                    {name}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                    {summary}
                </Text>
                <Separator />
                <VStack align="flex-start" gap={2} color="gray.500" fontSize="sm">
                    {details.map((item) => (
                        <Text key={item}>{`• ${item}`}</Text>
                    ))}
                </VStack>
            </VStack>
        </Card.Root>
    );
}
