"use client"

import React, { useState, } from "react";
import {
    Stack,
    Separator,
    Text,
    Button,
    Box,
    Grid,
    Flex,
    useBreakpointValue
} from "@chakra-ui/react";
import Scroll from "../_commons/Scroll";
import { useRouter } from "next/navigation";
import LoadingComponent from "../Loading/Loading";

export interface IPage {
    kor: string;
    eng: string;
    preview: React.ReactNode;
    href: string;
}

function Element({ p }: { p: IPage }) {
    return (
        <Stack
            alignItems="flex-start"
            width="100%"
            gap={0}
        >
            <Text
                margin={0}
                textStyle="xl"
                fontWeight="semibold"
            >
                {p.kor}
            </Text>
            <Text
                textStyle="xl"
                color="fg.muted"
                margin={0}
            >
                {p.eng}
            </Text>
        </Stack>
    );
}

export default function PageSelector({
    pages,
}: {
    pages: IPage[];
}) {
    const [key, setKey] = useState<number>(0);
    const router = useRouter();

    const isMd = useBreakpointValue({ base: false, md: true });

    return ((!pages || pages.length === 0) ? (
        <LoadingComponent />
    ) : (
        <Grid
            id="temp"
            gap={4}
            templateColumns={{
                base: "1fr",
                md: "auto 1fr"
            }}
            height="100%"
            minH={0}
        >
            <Scroll>
                <Box
                    minH="100%"
                    borderRightWidth={{
                        base: "0",
                        md: "1px"
                    }}
                >
                    <Stack
                        separator={<Separator />}
                        gap={0}
                        padding={0}
                        as={Flex}
                        direction="column"
                        minH={0}
                    >
                        {pages.map((p, i) => (
                            <Button
                                height="fit-content"
                                variant={{
                                    base: "ghost",
                                    md: (key === i || false) ? "subtle" : "ghost"
                                }}
                                width={{
                                    base: "100%",
                                    md: "calc(var(--screen-width) * 0.18)"
                                }}
                                padding={4}
                                onClick={() => {
                                    if (isMd) {
                                        setKey(i);
                                    } else {
                                        router.push(p.href);
                                    }
                                }}
                                key={p.href}
                            >
                                <Element p={p} />
                            </Button>
                        ))}
                    </Stack>
                </Box>
            </Scroll>
            {isMd && (
                <Scroll>
                    {pages[key].preview}
                </Scroll>
            )}
        </Grid>
    ));
}