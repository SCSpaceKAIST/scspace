"use client"

import { Badge, Card, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IRedirect } from "@scspace-client/Store/redirect";

const MotionDiv = motion.div;

interface FeatureCardProps {
    link: IRedirect;
    index: number;
    onSelect: (href: string) => void;
}

export default function FeatureCard({ link, index, onSelect }: FeatureCardProps) {
    const { helperText, label, href, subdomains } = link;
    const subdomainLabels = (subdomains ?? [])
        .filter((item) => !item.invisible && !item.disabled)
        .map((item) => item.label);
    const description = subdomainLabels.length > 0
        ? `${subdomainLabels.join(", ")} 메뉴를 함께 제공합니다.`
        : helperText ?? "바로가기";

    return (
        <MotionDiv
            key={href}
            role="group"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            whileHover={{ y: -6, scale: 1.015 }}
        >
            <Card.Root
                height="full"
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="gray.200"
                bg="white"
                shadow="lg"
                p={{ base: 6, md: 8 }}
                transition="all 0.2s ease"
                _groupHover={{ borderColor: "blue.300", shadow: "xl" }}
                cursor="pointer"
                onClick={() => onSelect(href)}
            >
                <VStack align="flex-start" gap={5} height="full">
                    <Badge variant="solid" colorPalette="blue" borderRadius="md">
                        {helperText ?? "Service"}
                    </Badge>
                    <Heading size="md" letterSpacing="-0.02em">
                        {label}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                        {description}
                    </Text>
                    <HStack gap={2} color="blue.500" fontWeight="semibold" fontSize="sm" mt="auto">
                        <Text>바로가기</Text>
                        <Text as="span" aria-hidden>
                            {" >"}
                        </Text>
                    </HStack>
                </VStack>
            </Card.Root>
        </MotionDiv>
    );
}
