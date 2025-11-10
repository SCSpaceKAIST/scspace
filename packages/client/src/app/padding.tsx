"use client";

import { Box } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

export default function LayoutBox({ children }: {
    children?: React.ReactNode
}) {
    const pathname = usePathname();

    return (
        <Box
            flexGrow={1}
            scrollbar="hidden"
            overflowY="hidden"
            scrollBehavior="smooth"
            bg="bg.subtle"
            px={pathname === "/" ? 0 : 4}
            py={pathname === "/" ? 0 : 6}
        >
            {children}
        </Box>
    );
}