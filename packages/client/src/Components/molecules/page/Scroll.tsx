import { Box, Center } from "@chakra-ui/react";
import React from "react";

export default function Scroll({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Center
            id="scroll"
            overflowY="auto"
            scrollbar="hidden"
            scrollBehavior="smooth"
            minH={0}
            height="100%"
            maxH="100%"
        >
            {children}
        </Center>
    );
}

export function XScroll({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Box
            id="x-scroll"
            overflowX="auto"
            scrollBehavior="smooth"
            minW={0}
            width="100%"
            maxW="100%"
        >
            {children}
        </Box>
    );
}