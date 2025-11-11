"use client"

import { Badge, Breadcrumb, Card, Flex, GridItem, Heading, Separator, SimpleGrid, Stack, StackSeparator, Text, VStack } from "@chakra-ui/react";

export interface TeamCardData {
    parent: string;
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
    const { parent, name, focus, summary, details, palette } = team;

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
            <Stack gap={4} height="full">
                <Flex justify={"space-between"}>
                    <Breadcrumb.Root fontWeight={"semibold"}>
                        <Breadcrumb.List>
                            <Breadcrumb.Item>
                                {parent}
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator />
                            <Breadcrumb.Item>
                                <Breadcrumb.CurrentLink>
                                    {name}
                                </Breadcrumb.CurrentLink>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                    <Badge colorPalette={palette} variant="subtle" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="semibold">
                        # {focus}
                    </Badge>
                </Flex>
                <Stack separator={<StackSeparator />}>
                    <Text color="gray.600" fontSize="sm">
                        {summary}
                    </Text>
                    <VStack align="flex-start" gap={2} color="gray.500" fontSize="sm">
                        {details.map((item) => (
                            <Text key={item}>{`• ${item}`}</Text>
                        ))}
                    </VStack>
                </Stack>
            </Stack>
        </Card.Root>
    );
}
