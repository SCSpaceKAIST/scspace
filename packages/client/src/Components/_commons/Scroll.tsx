import { Box } from "@chakra-ui/react";
import React from "react";

export default function Scroll({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Box
            id="scroll"
            overflowY="auto"
            scrollbar="hidden"
            scrollBehavior="smooth"
            minH={0}
            maxH="100%"
        >
            {children}
        </Box>
    );
}