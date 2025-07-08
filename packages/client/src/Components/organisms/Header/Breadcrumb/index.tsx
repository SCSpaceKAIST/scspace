"use client";

import { Box, Breadcrumb, Button, HStack, Text, useBreakpointValue } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Link, } from "@chakra-ui/react"
import Image from "next/image";

export default function BreadcrumbComponent() {
    const pathname = usePathname();

    const paths = pathname.split('/');
    let temp = "";
    const pathnames = paths.filter((p) => p).map((path, idx) => {
        temp += "/" + path;
        return {
            href: temp,
            value: path,
            isFinal: (paths.length === idx + 2),
        };
    });

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Breadcrumb.Root
            variant="plain"
        >
            <Breadcrumb.List margin={0} padding={0}>
                <Breadcrumb.Item>
                    <Breadcrumb.Link
                        as={Link}
                        href="/"
                        textDecoration="none"
                    >
                        <Button variant="ghost">
                            <HStack cursor="pointer" height="full">
                                <Text margin={0} padding={0} fontSize="xl" fontWeight="semibold" display={{ base: "none", md: "block" }}>
                                    학생문화공간위원회
                                </Text>
                                <Box
                                    position="relative"
                                    height="full"
                                    aspectRatio="1"
                                >
                                    <Image
                                        src="/img/logo.svg"
                                        alt="LOGO"
                                        fill
                                        objectFit="contain"
                                    />
                                </Box>
                            </HStack>
                        </Button>
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                {isWide && pathnames.map((pn) => (
                    <Fragment key={pn.href}>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.Link
                                as={Link}
                                href={pn.href}
                                textDecoration="none"
                            >
                                <Button
                                    variant={pn.isFinal ? "solid" : "outline"}
                                    rounded="sm"
                                >
                                    {pn.value}
                                </Button>
                            </Breadcrumb.Link>
                        </Breadcrumb.Item>
                    </Fragment>
                ))}
            </Breadcrumb.List>
        </Breadcrumb.Root>
    );
}