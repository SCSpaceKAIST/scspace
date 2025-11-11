"use client"

import { Box, DataList, Flex, Link, SimpleGrid, Stack } from "@chakra-ui/react";
import { useRedirectStore } from "@scspace-client/Store/redirect";

export default function LinkSection() {
    const { links } = useRedirectStore();

    return (
        <Box
            as="section"
            bg="gray.50"
            py={{ base: 16, md: 24 }}
            px={{ base: 6, md: 20 }}
        >
            <DataList.Root
                orientation={"vertical"}
                variant={"bold"}
            >
                <SimpleGrid
                    w={"full"}
                    columns={{
                        base: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: links.filter((link) => !link.invisible).length
                    }}
                    gap={8}
                >
                    {links.filter((link) => !link.invisible).map((link) => (
                        <DataList.Item
                            key={link.href}
                            alignItems={"start"}
                            gap={2}
                        >
                            <DataList.ItemLabel>
                                <Link href={link.href}>
                                    {link.label}
                                </Link>
                            </DataList.ItemLabel>
                            <DataList.ItemValue>
                                <Stack gap={2}>
                                    {link.subdomains && link.subdomains.filter((sub) => !sub.invisible).map((sub) => (
                                        <Link
                                            key={sub.href}
                                            href={sub.href}
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </Stack>
                            </DataList.ItemValue>
                        </DataList.Item>
                    ))}
                </SimpleGrid>
            </DataList.Root>
        </Box>
    );
}
